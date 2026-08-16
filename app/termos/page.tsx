import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";
import { getAllProductosDb } from "@/lib/db-products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos personalizados con grabado láser | Termazo",
  description:
    "Elige entre Termo 20 oz, 30 oz o Skinny 20 oz. Personaliza con tu nombre, frase o logo y míralo grabado antes de comprar.",
};

export default async function CatalogoTermos() {
  const termos = await getAllProductosDb();

  return (
    <main>
      <Navbar />
      <section className="bg-grafito text-hueso pt-40 pb-16 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow text-plata mb-5">Catálogo</span>
          <h1 className="font-display font-medium text-4xl md:text-6xl max-w-2xl">
            Elige tu termo.
          </h1>
          <p className="mt-5 max-w-md text-plata">
            Tres formatos, un mismo estándar de grabado láser. Elige el tuyo
            y empieza a personalizarlo.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-10 py-20">
        <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-8">
          {termos.map((t) => (
            <ProductCard key={t.slug} t={t} />
          ))}
        </div>
      </section>

      <CtaFinalYFooter />
    </main>
  );
}
