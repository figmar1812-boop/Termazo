"use client";

import { useState } from "react";
import { Termo } from "@/lib/products";

export default function ColorSelector({ colores }: { colores: Termo["colores"] }) {
  const [seleccionado, setSeleccionado] = useState(0);

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">
        Color: <span className="text-grafito font-semibold">{colores[seleccionado].nombre}</span>
      </p>
      <div className="flex gap-3">
        {colores.map((c, i) => (
          <button
            key={c.hex}
            onClick={() => setSeleccionado(i)}
            aria-label={c.nombre}
            className={`h-9 w-9 rounded-full border-2 transition-transform ${
              i === seleccionado ? "border-cobre scale-110" : "border-transparent"
            }`}
            style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
          />
        ))}
      </div>
    </div>
  );
}
