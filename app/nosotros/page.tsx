import Navbar from "@/components/Navbar";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros | Termazo",
  description: "Conoce la historia de Termazo, grabado láser hecho en México.",
};

export default function NosotrosPage() {
  return (
    <main>
      <Navbar />
      <section className="px-6 md:px-10 pt-40 pb-28 min-h-[50vh] flex items-center">
        <div className="mx-auto max-w-7xl">
          <span className="eyebrow text-cobre-dim font-bold mb-6">Nosotros</span>
          <h1 className="font-display font-medium text-4xl md:text-6xl max-w-2xl mb-6">
            No es cualquier termo. Es tu Termazo.
          </h1>
          <p className="text-grafito/60 max-w-md mb-10">
            Estamos escribiendo nuestra historia. Muy pronto vas a poder leer
            aquí quiénes somos, por qué nació Termazo, y todo lo que
            necesitas saber sobre envíos, pagos y cambios.
          </p>
          <a
            href="/personaliza"
            className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
          >
            Personaliza tu termo →
          </a>
        </div>
      </section>
      <CtaFinalYFooter />
    </main>
  );
}
