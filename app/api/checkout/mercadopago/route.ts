import { NextResponse } from "next/server";
import { z } from "zod";
import { Preference } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { prisma } from "@/lib/db";

const BodySchema = z.object({
  numeroPedido: z.string().min(1),
});

// POST /api/checkout/mercadopago
// Recibe el número de un pedido YA creado (estado PENDIENTE_PAGO) y genera
// la preferencia de Checkout Pro en Mercado Pago. El frontend redirige al
// cliente a la URL que devuelve este endpoint (init_point).
//
// IMPORTANTE: el pedido nunca se marca como pagado aquí. Eso solo pasa en
// el webhook (/api/webhooks/mercadopago), cuando Mercado Pago confirma el
// pago de verdad — así cumplimos la regla del punto 22 del brief.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "numeroPedido requerido" }, { status: 400 });
  }

  const pedido = await prisma.order.findUnique({
    where: { numeroPedido: parsed.data.numeroPedido },
    include: { items: true, customer: true },
  });

  if (!pedido) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  if (pedido.estado !== "PENDIENTE_PAGO") {
    return NextResponse.json({ error: "Este pedido ya no está pendiente de pago" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  try {
    const preference = await new Preference(mpClient).create({
      body: {
        items: [
          ...pedido.items.map((item) => ({
            id: item.id,
            title: `Termazo — ${item.texto || "personalizado"}`,
            quantity: item.cantidad,
            unit_price: item.precioUnitario,
            currency_id: "MXN",
          })),
          ...(pedido.costoEnvio > 0
            ? [
                {
                  id: "envio",
                  title: "Envío",
                  quantity: 1,
                  unit_price: pedido.costoEnvio,
                  currency_id: "MXN",
                },
              ]
            : []),
        ],
        payer: {
          name: pedido.customer.nombre,
          email: pedido.customer.email,
        },
        external_reference: pedido.numeroPedido,
        back_urls: {
          success: `${baseUrl}/pedido-confirmado?pedido=${pedido.numeroPedido}`,
          pending: `${baseUrl}/pedido-confirmado?pedido=${pedido.numeroPedido}`,
          failure: `${baseUrl}/checkout?error=pago_fallido`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      },
    });

    return NextResponse.json({ initPoint: preference.init_point });
  } catch (err: any) {
    console.error("Error creando preferencia de Mercado Pago:", err);
    return NextResponse.json({ error: "No se pudo iniciar el pago" }, { status: 502 });
  }
}
