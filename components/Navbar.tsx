"use client";

import { useState } from "react";
import { useCarrito } from "@/context/CarritoContext";

const LINKS = [
  { href: "/termos", label: "Termos" },
  { href: "/complementos", label: "Complementos" },
  { href: "/inspiracion", label: "Inspiración" },
  { href: "/empresas", label: "Empresas" },
];

export default function Navbar() {
  const { cantidadTotal } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-grafito/95 backdrop-blur text-hueso">
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
        <a href="/" className="font-display text-2xl tracking-tight">
          Termazo
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-plata">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-hueso transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a href="/carrito" className="relative text-sm text-plata hover:text-hueso transition-colors">
            Carrito
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
            Personalizar mi termo
          </a>

          {/* Botón hamburguesa — solo visible en celular/tablet */}
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            aria-label="Abrir menú"
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`block h-0.5 w-5 bg-hueso transition-transform ${menuAbierto ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-5 bg-hueso transition-opacity ${menuAbierto ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-hueso transition-transform ${menuAbierto ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <nav className="md:hidden bg-grafito border-t border-hueso/10 px-6 py-4 flex flex-col gap-4">
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
            className="bg-cobre text-grafito text-sm font-bold px-5 py-2.5 rounded-sm text-center sm:hidden"
          >
            Personalizar mi termo
          </a>
        </nav>
      )}
    </header>
  );
}
