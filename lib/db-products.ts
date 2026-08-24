import { prisma } from "./db";
import { Termo } from "./products";

function mapProducto(p: any): Termo {
  return {
    slug: p.slug,
    nombre: p.nombre,
    precio: `$${p.precioBase} MXN`,
    desde: p.precioBase,
    desc: p.descripcion,
    detalle: p.descripcion,
    colores: p.colores.map((c: any) => ({
      nombre: c.nombre,
      hex: c.hex,
      imagenUrl: c.imagenUrl ?? undefined,
    })),
    zonaGrabado: { top: p.zonaTop, bottom: p.zonaBottom, left: p.zonaLeft, right: p.zonaRight },
  };
}

export async function getAllProductosDb(): Promise<Termo[]> {
  const productos = await prisma.product.findMany({
    where: { activo: true },
    include: { colores: true },
    orderBy: { createdAt: "asc" },
  });
  return productos.map(mapProducto);
}

export async function getProductoBySlugDb(slug: string): Promise<Termo | null> {
  const producto = await prisma.product.findUnique({
    where: { slug },
    include: { colores: true },
  });
  return producto ? mapProducto(producto) : null;
}
