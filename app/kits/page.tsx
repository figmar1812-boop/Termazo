import Navbar from "@/components/Navbar";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kits | Termazo",
  description: "Kits de productos personalizados Termazo. Próximamente.",
};

export default function KitsPage() {
  return (
    <main>
      <Navbar />
      <section className="px-6 md:px-10 pt-40 pb-28 min-h-[50vh] flex items-center">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow text-cobre-dim font-bold mb-6">Kits</span>
          <h1 className="font-display font-medium text-4xl md:text-6xl max-w-2xl mb-6">
            Estamos armando kits que se van a antojar.
          </h1>
          <p className="text-grafito/60 max-w-md mb-10">
            Combos de termo + complementos, listos para regalar o para ti.
            Muy pronto aquí.
          </p>
          <a
            href="/personaliza"
            className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
          >
            Mientras tanto, personaliza tu termo →
          </a>
        </div>
      </section>
      <CtaFinalYFooter />
    </main>
  );
}
