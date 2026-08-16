import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { precioConDescuento } from "@/lib/pricing";
import { enviarEmailPedido } from "@/lib/email";
import { calcularCostoEnvio } from "@/lib/shipping";

// Esquema de validación estricta del pedido — rechaza cualquier dato mal
// formado antes de tocar la base de datos (punto 41 del brief).
const ItemPedidoSchema = z.object({
  productoSlug: z.string().min(1),
  precioUnitario: z.number().positive(),
  colorNombre: z.string().min(1),
  colorHex: z.string().min(1),
  texto: z.string().max(22).optional().default(""),
  fuenteNombre: z.string().min(1),
  posicion: z.string().min(1),
  tamano: z.number().min(0).max(100).default(50),
  cantidad: z.number().int().min(1).max(500),
});

const PedidoSchema = z.object({
  cliente: z.object({
    nombre: z.string().min(1),
    email: z.string().email(),
    telefono: z.string().min(7),
  }),
  items: z.array(ItemPedidoSchema).min(1),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = PedidoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de pedido inválidos", detalles: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { cliente, items } = parsed.data;

  // Verificamos que cada producto exista de verdad en la base de datos antes
  // de crear el pedido — nunca confiamos en el precio que venga del navegador.
  const productosDb = await prisma.product.findMany({
    where: { slug: { in: items.map((i) => i.productoSlug) } },
  });

  if (productosDb.length !== new Set(items.map((i) => i.productoSlug)).size) {
    return NextResponse.json({ error: "Uno o más productos no existen" }, { status: 400 });
  }

  const subtotal = items.reduce((acc, i) => {
    const productoDb = productosDb.find((p) => p.slug === i.productoSlug)!;
    return acc + precioConDescuento(productoDb.precioBase, i.cantidad) * i.cantidad;
  }, 0);
  const costoEnvio = calcularCostoEnvio(subtotal);
  const total = subtotal + costoEnvio;

  const numeroPedido = `TZ-${Date.now()}`;

  const pedido = await prisma.order.create({
    data: {
      numeroPedido,
      subtotal,
      costoEnvio,
      total,
      estado: "PENDIENTE_PAGO",
      customer: {
        connectOrCreate: {
          where: { email: cliente.email },
          create: cliente,
        },
      },
      items: {
        create: items.map((i) => {
          const productoDb = productosDb.find((p) => p.slug === i.productoSlug)!;
          return {
            cantidad: i.cantidad,
            precioUnitario: precioConDescuento(productoDb.precioBase, i.cantidad),
            colorNombre: i.colorNombre,
            colorHex: i.colorHex,
            texto: i.texto,
            fuenteNombre: i.fuenteNombre,
            posicion: i.posicion,
            tamano: i.tamano,
            productId: productoDb.id,
          };
        }),
      },
    },
    include: { items: true, customer: true },
  });

  await enviarEmailPedido("recibido", {
    numeroPedido: pedido.numeroPedido,
    total: pedido.total,
    customer: pedido.customer,
  });

  return NextResponse.json({ pedido }, { status: 201 });
}
