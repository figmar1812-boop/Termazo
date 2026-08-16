import Navbar from "@/components/Navbar";
import Personalizador from "@/components/Personalizador";
import { getAllProductosDb } from "@/lib/db-products";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Personaliza tu termo | Termazo",
  description:
    "Escribe tu nombre o frase, elige tipografía, tamaño y posición, y mira tu termo grabado antes de comprarlo.",
};

export default async function PersonalizaPage() {
  const termos = await getAllProductosDb();

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-24 px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <Personalizador termos={termos} />
        </div>
      </section>
    </main>
  );
}
