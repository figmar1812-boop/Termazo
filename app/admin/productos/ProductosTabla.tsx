"use client";

import { useState } from "react";

export default function ProductosTabla({ productos: iniciales }: { productos: any[] }) {
  const [productos, setProductos] = useState(iniciales);
  const [guardando, setGuardando] = useState<string | null>(null);

  async function actualizar(id: string, cambios: Record<string, any>) {
    setGuardando(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });
      if (!res.ok) throw new Error();
      setProductos((prev) => prev.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
    } catch {
      alert("No se pudo guardar el cambio.");
    } finally {
      setGuardando(null);
    }
  }

  return (
    <div className="bg-white border border-grafito/10">
      <div className="grid grid-cols-[1.4fr_140px_1fr_120px_100px] gap-4 px-5 py-3 text-xs uppercase tracking-widest text-grafito/40 border-b border-grafito/10">
        <span>Producto</span>
        <span>Precio (MXN)</span>
        <span>Colores</span>
        <span>Inventario</span>
        <span>Activo</span>
      </div>
      {productos.map((p) => (
        <div
          key={p.id}
          className="grid grid-cols-[1.4fr_140px_1fr_120px_100px] gap-4 px-5 py-4 items-center text-sm border-b border-grafito/5 last:border-0"
        >
          <div>
            <p className="font-semibold">{p.nombre}</p>
            <p className="text-xs text-grafito/40">{p.slug}</p>
          </div>

          <input
            type="number"
            defaultValue={p.precioBase}
            onBlur={(e) => {
              const val = Number(e.target.value);
              if (val !== p.precioBase) actualizar(p.id, { precioBase: val });
            }}
            className="border border-grafito/20 rounded-sm px-2 py-1.5 w-24 focus:outline-none focus:border-cobre"
          />

          <div className="flex gap-1.5">
            {p.colores.map((c: any) => (
              <span
                key={c.id}
                title={c.nombre}
                className="h-5 w-5 rounded-full border border-grafito/10"
                style={{ background: c.hex }}
              />
            ))}
          </div>

          <input
            type="number"
            defaultValue={p.inventario}
            onBlur={(e) => {
              const val = Number(e.target.value);
              if (val !== p.inventario) actualizar(p.id, { inventario: val });
            }}
            className="border border-grafito/20 rounded-sm px-2 py-1.5 w-20 focus:outline-none focus:border-cobre"
          />

          <button
            onClick={() => actualizar(p.id, { activo: !p.activo })}
            disabled={guardando === p.id}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              p.activo ? "bg-green-100 text-green-700" : "bg-grafito/10 text-grafito/50"
            }`}
          >
            {p.activo ? "Activo" : "Inactivo"}
          </button>
        </div>
      ))}
      <p className="text-xs text-grafito/40 px-5 py-3">
        Cambia el precio o inventario y da clic fuera del campo para guardar. Crear/eliminar productos y editar colores llega en una siguiente iteración de esta fase.
      </p>
    </div>
  );
}
