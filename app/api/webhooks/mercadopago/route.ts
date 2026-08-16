import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { prisma } from "@/lib/db";
import { enviarEmailPedido } from "@/lib/email";

// POST /api/webhooks/mercadopago
//
// Mercado Pago llama a esta URL automáticamente cuando el estado de un pago
// cambia (aprobado, rechazado, etc.). Esta es la ÚNICA forma en la que un
// pedido pasa de PENDIENTE_PAGO a PAGADO — nunca por el regreso del
// navegador a la página de éxito (punto 22 del brief).
//
// Flujo:
// 1. Mercado Pago manda { type: "payment", data: { id } }
// 2. Consultamos ese pago directo en la API de Mercado Pago (nunca confiamos
//    en el monto/estado que venga en el body del webhook sin verificar)
// 3. Buscamos el pedido por external_reference (el numeroPedido que le
//    mandamos al crear la preferencia)
// 4. Actualizamos el estado del pedido según el estado real del pago
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: true }); // Mercado Pago reintenta si no respondemos 200
  }

  const paymentId = body?.data?.id;
  if (!paymentId || body?.type !== "payment") {
    // Mercado Pago manda otros tipos de eventos que no nos interesan — respondemos
    // 200 igual para que no siga reintentando algo que no vamos a procesar.
    return NextResponse.json({ ok: true });
  }

  try {
    const payment = await new Payment(mpClient).get({ id: paymentId });
    const numeroPedido = payment.external_reference;

    if (!numeroPedido) {
      return NextResponse.json({ ok: true });
    }

    const nuevoEstado =
      payment.status === "approved"
        ? "PAGADO"
        : payment.status === "rejected"
        ? "CANCELADO"
        : "PENDIENTE_PAGO";

    const pedido = await prisma.order.findUnique({
      where: { numeroPedido },
      include: { customer: true },
    });
    if (!pedido) return NextResponse.json({ ok: true });

    // Si el pedido ya estaba en este mismo estado, no reenviamos el email
    // (Mercado Pago puede mandar el mismo webhook más de una vez).
    const yaEstabaEnEsteEstado = pedido.estado === nuevoEstado;

    await prisma.order.update({
      where: { numeroPedido },
      data: { estado: nuevoEstado },
    });

    await prisma.payment.upsert({
      where: { orderId: pedido.id },
      create: {
        orderId: pedido.id,
        pasarela: "mercadopago",
        referenciaId: String(paymentId),
        estado: payment.status ?? "unknown",
        montoRecibido: Math.round(payment.transaction_amount ?? 0),
      },
      update: {
        estado: payment.status ?? "unknown",
        referenciaId: String(paymentId),
      },
    });

    if (!yaEstabaEnEsteEstado) {
      if (nuevoEstado === "PAGADO") {
        await enviarEmailPedido("pagado", {
          numeroPedido: pedido.numeroPedido,
          total: pedido.total,
          customer: pedido.customer,
        });
      } else if (nuevoEstado === "CANCELADO") {
        await enviarEmailPedido("rechazado", {
          numeroPedido: pedido.numeroPedido,
          total: pedido.total,
          customer: pedido.customer,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error procesando webhook de Mercado Pago:", err);
    // Respondemos 200 igual: si devolvemos error, Mercado Pago reintentará
    // indefinidamente. Este error ya quedó en los logs para revisarlo.
    return NextResponse.json({ ok: true });
  }
}
