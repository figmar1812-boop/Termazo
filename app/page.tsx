import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ComoFunciona from "@/components/ComoFunciona";
import TermosPopulares from "@/components/TermosPopulares";
import PersonalizaTeaser from "@/components/PersonalizaTeaser";
import Inspiracion from "@/components/Inspiracion";
import Complementos from "@/components/Complementos";
import Empresas from "@/components/Empresas";
import Testimonios from "@/components/Testimonios";
import Faq from "@/components/Faq";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";
import { getAllProductosDb } from "@/lib/db-products";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Termazo | Termos personalizados con grabado láser",
  description:
    "Personaliza tu termo Termazo con nombre, frase o logo. Visualiza el grabado láser antes de comprar. Termos personalizados con envíos a todo México.",
};

export default async function Home() {
  const termos = await getAllProductosDb();

  return (
    <main>
      <Navbar />
      <Hero />
      <ComoFunciona />
      <TermosPopulares termos={termos} />
      <PersonalizaTeaser />
      <Inspiracion />
      <Complementos />
      <Empresas />
      <Testimonios />
      <Faq />
      <CtaFinalYFooter />
    </main>
  );
}
