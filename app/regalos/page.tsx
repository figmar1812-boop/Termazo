import Navbar from "@/components/Navbar";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regalos personalizados | Termazo",
  description: "Ideas de regalo personalizado con grabado láser. Próximamente.",
};

export default function RegalosPage() {
  return (
    <main>
      <Navbar />
      <section className="px-6 md:px-10 pt-40 pb-28 min-h-[50vh] flex items-center">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow text-cobre-dim font-bold mb-6">Regalos</span>
          <h1 className="font-display font-medium text-4xl md:text-6xl max-w-2xl mb-6">
            Ideas de regalo con su nombre grabado.
          </h1>
          <p className="text-grafito/60 max-w-md mb-10">
            Estamos preparando una guía de regalos por ocasión. Mientras
            tanto, cualquiera de nuestros termos personalizados es un
            excelente regalo.
          </p>
          <a
            href="/personaliza"
            className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
          >
            Personaliza un regalo ahora →
          </a>
        </div>
      </section>
      <CtaFinalYFooter />
    </main>
  );
}
