import { prisma } from "@/lib/db";
import ProductosTabla from "./ProductosTabla";

export const dynamic = "force-dynamic";

export default async function AdminProductos() {
  const productos = await prisma.product.findMany({
    include: { colores: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Productos</h1>
      <ProductosTabla productos={JSON.parse(JSON.stringify(productos))} />
    </div>
  );
}
