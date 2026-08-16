import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/products
// Ahora lee de la base de datos real (Fase 9). El frontend consume este
// endpoint exactamente igual que antes, cuando leía de lib/products.ts.
export async function GET() {
  const productos = await prisma.product.findMany({
    where: { activo: true },
    include: { colores: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ productos });
}
