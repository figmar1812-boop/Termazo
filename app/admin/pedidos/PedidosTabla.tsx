"use client";

import { useState } from "react";

const ESTADOS = [
  "PENDIENTE_PAGO",
  "PAGADO",
  "EN_PRODUCCION",
  "GRABADO",
  "EMPACADO",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

const ESTADO_COLOR: Record<string, string> = {
  PENDIENTE_PAGO: "bg-grafito/10 text-grafito/60",
  PAGADO: "bg-green-100 text-green-700",
  EN_PRODUCCION: "bg-amber-100 text-amber-700",
  GRABADO: "bg-amber-100 text-amber-700",
  EMPACADO: "bg-blue-100 text-blue-700",
  ENVIADO: "bg-blue-100 text-blue-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

export default function PedidosTabla({ pedidos: pedidosIniciales }: { pedidos: any[] }) {
  const [pedidos, setPedidos] = useState(pedidosIniciales);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [actualizando, setActualizando] = useState<string | null>(null);

  async function cambiarEstado(numeroPedido: string, nuevoEstado: string) {
    setActualizando(numeroPedido);
    try {
      const res = await fetch(`/api/orders/${numeroPedido}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error();
      setPedidos((prev) =>
        prev.map((p) => (p.numeroPedido === numeroPedido ? { ...p, estado: nuevoEstado } : p))
      );
    } catch {
      alert("No se pudo actualizar el estado. Intenta de nuevo.");
    } finally {
      setActualizando(null);
    }
  }

  if (pedidos.length === 0) {
    return <p className="text-grafito/50">Todavía no hay pedidos.</p>;
  }

  return (
    <div className="bg-white border border-grafito/10">
      <div className="grid grid-cols-[1fr_1fr_1fr_140px_180px] gap-4 px-5 py-3 text-xs uppercase tracking-widest text-grafito/40 border-b border-grafito/10">
        <span>Pedido</span>
        <span>Cliente</span>
        <span>Total</span>
        <span>Fecha</span>
        <span>Estado</span>
      </div>
      {pedidos.map((p) => (
        <div key={p.id} className="border-b border-grafito/5 last:border-0">
          <div
            className="grid grid-cols-[1fr_1fr_1fr_140px_180px] gap-4 px-5 py-4 items-center text-sm cursor-pointer hover:bg-hueso"
            onClick={() => setExpandido(expandido === p.id ? null : p.id)}
          >
            <span className="font-semibold">{p.numeroPedido}</span>
            <span className="text-grafito/70">{p.customer.nombre}</span>
            <span>${p.total} MXN</span>
            <span className="text-grafito/50 text-xs">
              {new Date(p.createdAt).toLocaleDateString("es-MX")}
            </span>
            <select
              value={p.estado}
              disabled={actualizando === p.numeroPedido}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => cambiarEstado(p.numeroPedido, e.target.value)}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 border-none outline-none cursor-pointer ${ESTADO_COLOR[p.estado]}`}
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>
                  {e.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {expandido === p.id && (
            <div className="bg-hueso px-5 py-4 text-sm">
              <p className="text-xs text-grafito/50 mb-3">
                {p.customer.email} · {p.customer.telefono}
              </p>
              <div className="space-y-2">
                {p.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-xs border-b border-grafito/5 pb-2">
                    <span>
                      {item.product?.nombre} · &ldquo;{item.texto}&rdquo; · {item.colorNombre} ·{" "}
                      {item.fuenteNombre} · {item.posicion} × {item.cantidad}
                    </span>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Generación de archivo SVG para LightBurn — se conecta en la Fase 14b / cuando confirmes el flujo de producción.");
                      }}
                      className="text-cobre-dim underline shrink-0 ml-4"
                    >
                      Descargar archivo de producción
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
