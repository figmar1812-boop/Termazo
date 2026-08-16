import { Termo } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function TermosPopulares({ termos }: { termos: Termo[] }) {
  return (
    <section className="px-6 md:px-10 py-24 bg-hueso border-b border-grafito/10">
      <div className="mx-auto max-w-7xl">
        <span className="eyebrow text-cobre-dim font-bold mb-4">Los más elegidos</span>
        <h2 className="font-display font-medium text-3xl md:text-4xl max-w-xl mb-14">
          Tres termos. Un mismo estándar de grabado.
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {termos.map((t) => (
            <ProductCard key={t.slug} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
