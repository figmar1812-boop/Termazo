import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { enviarEmailPedido, TipoEmail } from "@/lib/email";

// GET /api/orders/[numeroPedido] — consultar un pedido (usado por la página
// de confirmación y, después, por el cliente para rastrear su pedido).
export async function GET(
  _req: Request,
  { params }: { params: { numeroPedido: string } }
) {
  const pedido = await prisma.order.findUnique({
    where: { numeroPedido: params.numeroPedido },
    include: { items: { include: { product: true } }, customer: true, payment: true },
  });

  if (!pedido) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ pedido });
}

const EstadoSchema = z.object({
  estado: z.enum([
    "PENDIENTE_PAGO",
    "PAGADO",
    "EN_PRODUCCION",
    "GRABADO",
    "EMPACADO",
    "ENVIADO",
    "ENTREGADO",
    "CANCELADO",
  ]),
});

// PATCH /api/orders/[numeroPedido] — cambiar el estado de un pedido.
// Se usa desde el panel administrativo (Fase 15) y desde el webhook de la
// pasarela de pago (Fase 12) para pasar de PENDIENTE_PAGO a PAGADO.
// NOTA: este endpoint todavía no tiene protección de autenticación de admin
// — eso se agrega en la Fase 15 y se refuerza en la Fase 20 (seguridad).
export async function PATCH(
  req: Request,
  { params }: { params: { numeroPedido: string } }
) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = EstadoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  try {
    const pedido = await prisma.order.update({
      where: { numeroPedido: params.numeroPedido },
      data: { estado: parsed.data.estado },
      include: { customer: true },
    });

    const mapaEmail: Partial<Record<string, TipoEmail>> = {
      EN_PRODUCCION: "en_produccion",
      ENVIADO: "enviado",
      ENTREGADO: "entregado",
    };
    const tipoEmail = mapaEmail[parsed.data.estado];
    if (tipoEmail) {
      await enviarEmailPedido(tipoEmail, {
        numeroPedido: pedido.numeroPedido,
        total: pedido.total,
        customer: pedido.customer,
      });
    }

    return NextResponse.json({ pedido });
  } catch {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }
}
