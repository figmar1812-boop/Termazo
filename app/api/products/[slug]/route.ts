import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/products/[slug]
export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const producto = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { colores: true },
  });

  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ producto });
}
