"use client";

import { useState, useEffect } from "react";
import { useCarrito } from "@/context/CarritoContext";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/termos", label: "Termos" },
  { href: "/personaliza", label: "Personaliza" },
  { href: "/kits", label: "Kits" },
  { href: "/regalos", label: "Regalos" },
  { href: "/empresas", label: "Empresas" },
  { href: "/nosotros", label: "Nosotros" },
];

export default function Navbar() {
  const { cantidadTotal } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [conScroll, setConScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setConScroll(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-grafito/95 backdrop-blur text-hueso transition-all duration-300 ${
        conScroll ? "shadow-[0_2px_16px_rgba(0,0,0,0.18)]" : ""
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between transition-all duration-300 ${
          conScroll ? "h-16" : "h-20"
        }`}
      >
        <a href="/" className="shrink-0 flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-navbar.png"
            alt="Termazo"
            className={`w-auto transition-all duration-300 ${conScroll ? "h-9" : "h-11"}`}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-7 text-sm text-plata">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-hueso transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href="/carrito" className="relative text-sm text-plata hover:text-hueso transition-colors">
            <span className="hidden sm:inline">Carrito</span>
            <span className="sm:hidden">🛒</span>
            {cantidadTotal > 0 && (
              <span className="absolute -top-2 -right-3 bg-cobre text-grafito text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cantidadTotal}
              </span>
            )}
          </a>
          <a
            href="/personaliza"
            className="hidden sm:inline-block bg-cobre text-grafito text-sm font-bold px-5 py-2.5 rounded-sm hover:bg-cobre-dim transition-colors"
          >
            Personaliza ahora
          </a>

          {/* Botón hamburguesa — visible hasta el breakpoint "lg" */}
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú"
            className="lg:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`block h-0.5 w-5 bg-hueso transition-transform ${menuAbierto ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-hueso transition-opacity ${menuAbierto ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-hueso transition-transform ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menú móvil / tablet desplegable */}
      {menuAbierto && (
        <nav className="lg:hidden bg-grafito border-t border-hueso/10 px-6 py-4 flex flex-col gap-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuAbierto(false)}
              className="text-plata text-sm hover:text-hueso transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/personaliza"
            onClick={() => setMenuAbierto(false)}
            className="bg-cobre text-grafito text-sm font-bold px-5 py-2.5 rounded-sm text-center"
          >
            Personaliza ahora
          </a>
        </nav>
      )}
    </header>
  );
}
