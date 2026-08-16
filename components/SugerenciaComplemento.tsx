"use client";

import { useCarrito } from "@/context/CarritoContext";

// NOTA: precios de ejemplo — cuando los complementos (Portalata, Vinero,
// Taza) tengan su propia página de producto en Fase 17, esto se conecta a
// la base de datos real en vez de estar escrito a mano aquí.
const COMPLEMENTO_SUGERIDO = {
  nombre: "Vinero personalizado",
  precio: 280,
  slug: "vinero",
};

export default function SugerenciaComplemento() {
  const { agregarItem } = useCarrito();

  return (
    <div className="mb-8 border border-dashed border-cobre/40 bg-cobre/5 p-4 rounded-sm flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">
          ¿Agregas un {COMPLEMENTO_SUGERIDO.nombre.toLowerCase()}?
        </p>
        <p className="text-xs text-grafito/60">
          Combina perfecto con tu termo · ${COMPLEMENTO_SUGERIDO.precio} MXN
        </p>
      </div>
      <button
        onClick={() =>
          agregarItem({
            productoSlug: COMPLEMENTO_SUGERIDO.slug,
            productoNombre: COMPLEMENTO_SUGERIDO.nombre,
            precioUnitario: COMPLEMENTO_SUGERIDO.precio,
            colorNombre: "Grafito",
            colorHex: "#1A1A1A",
            texto: "(sin grabado)",
            fuenteNombre: "—",
            posicion: "—",
            tamano: 50,
          })
        }
        className="shrink-0 text-xs font-bold border border-cobre text-cobre-dim px-4 py-2 rounded-sm hover:bg-cobre hover:text-grafito transition-colors"
      >
        Agregar
      </button>
    </div>
  );
}
