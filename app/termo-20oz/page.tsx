import Navbar from "@/components/Navbar";
import GaleriaProducto from "@/components/GaleriaProducto";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";
import ResenasProducto from "@/components/ResenasProducto";
import FaqProducto from "@/components/FaqProducto";
import { getProductoBySlugDb } from "@/lib/db-products";
import { prisma } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SLUG = "termo-20oz";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Termo 20 oz personalizado con grabado láser | Termazo",
  description:
    "Personaliza tu Termo 20 oz con tu nombre, frase o logo. Grabado láser real, vista previa antes de comprar.",
};

async function contarComprasRecientes(slug: string) {
  const treintaDiasAtras = new Date();
  treintaDiasAtras.setDate(treintaDiasAtras.getDate() - 30);
  return prisma.orderItem.count({
    where: {
      product: { slug },
      order: {
        estado: { notIn: ["PENDIENTE_PAGO", "CANCELADO"] },
        createdAt: { gte: treintaDiasAtras },
      },
    },
  });
}

export default async function Termo20oz() {
  const producto = await getProductoBySlugDb(SLUG);
  if (!producto) return notFound();

  const comprasRecientes = await contarComprasRecientes(SLUG);

  return (
    <main>
      <Navbar />

      <section className="pt-32 pb-10 px-6 md:px-10">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-start">
          <GaleriaProducto producto={producto} />

          <div>
            <span className="eyebrow text-cobre-dim font-bold mb-4">Termo</span>
            <h1 className="font-display font-medium text-4xl md:text-5xl mb-4">
              {producto.nombre}
            </h1>
            <p className="text-xl font-bold mb-2">{producto.precio}</p>

            {comprasRecientes > 0 && (
              <p className="text-xs text-cobre-dim font-semibold mb-6">
                {comprasRecientes} {comprasRecientes === 1 ? "persona compró" : "personas compraron"} este termo en los últimos 30 días
              </p>
            )}

            <p className="text-grafito/70 max-w-md mb-8">{producto.detalle}</p>

            <a
              href="/personaliza"
              className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
            >
              Personalizar este termo →
            </a>

            <div className="flex items-center gap-2 mt-4 text-xs text-grafito/60">
              <svg viewBox="0 0 20 20" className="h-4 w-4 fill-cobre-dim shrink-0">
                <path d="M10 1l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V4l7-3z" />
              </svg>
              Garantía: si el grabado no coincide con lo aprobado, lo hacemos de nuevo sin costo.
            </div>

            <div className="mt-12 border-t border-grafito/10 pt-8 grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-bold mb-1">Grabado</p>
                <p className="text-grafito/60">Láser real, no impresión.</p>
              </div>
              <div>
                <p className="font-bold mb-1">Envío</p>
                <p className="text-grafito/60">A toda la República Mexicana. Gratis desde $1,200 MXN.</p>
              </div>
              <div>
                <p className="font-bold mb-1">Producción</p>
                <p className="text-grafito/60">2–4 días hábiles.</p>
              </div>
              <div>
                <p className="font-bold mb-1">Personalización</p>
                <p className="text-grafito/60">Nombre, frase o logo.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl">
          <ResenasProducto />
          <FaqProducto />
        </div>
      </section>

      <CtaFinalYFooter />
    </main>
  );
}
