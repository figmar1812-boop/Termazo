import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/context/CarritoContext";
import WhatsAppFlotante from "@/components/WhatsAppFlotante";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-fraunces",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Termazo | Termos personalizados con grabado láser",
  description:
    "No es cualquier termo. Es tu Termazo. Personaliza tu termo con nombre, logo o frase y velo grabado antes de comprarlo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="font-body">
        <CarritoProvider>
          {children}
          <WhatsAppFlotante />
        </CarritoProvider>
      </body>
    </html>
  );
}
