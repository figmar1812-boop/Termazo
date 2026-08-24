"use client";

import { useState } from "react";
import { Termo } from "@/lib/products";

export default function GaleriaProducto({ producto }: { producto: Termo }) {
  const [colorIdx, setColorIdx] = useState(0);
  const color = producto.colores[colorIdx];

  return (
    <div>
      {/* Foto real del termo en el color elegido */}
      <div className="bg-grafito aspect-square flex items-center justify-center sticky top-24 overflow-hidden">
        {color?.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={color.imagenUrl}
            src={color.imagenUrl}
            alt={`${producto.nombre} — ${color.nombre}`}
            className="h-full w-full object-contain p-10"
          />
        ) : (
          <div
            className="h-3/5 w-1/4 rounded-[70px_70px_18px_18px] border border-plata/15"
            style={{ background: `linear-gradient(180deg, ${color?.hex}dd, ${color?.hex})` }}
          />
        )}
      </div>

      {/* Selector de color con miniaturas reales */}
      <div className="mt-6">
        <p className="text-xs uppercase tracking-widest text-grafito/50 mb-3">
          Color: <span className="text-grafito font-semibold">{color?.nombre}</span>
        </p>
        <div className="flex gap-2 flex-wrap">
          {producto.colores.map((c, i) => (
            <button
              key={c.hex + i}
              onClick={() => setColorIdx(i)}
              aria-label={c.nombre}
              className={`h-9 w-9 rounded-full border-2 transition-transform ${
                i === colorIdx ? "border-cobre scale-110" : "border-transparent"
              }`}
              style={{ background: c.hex, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
