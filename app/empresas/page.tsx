import Navbar from "@/components/Navbar";
import Empresas from "@/components/Empresas";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos para empresas | Termazo",
  description:
    "Termos personalizados con grabado láser para empresas. Regalos corporativos, eventos y onboarding desde 10 piezas.",
};

export default function EmpresasPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-20">
        <Empresas />
      </div>
      <CtaFinalYFooter />
    </main>
  );
}
