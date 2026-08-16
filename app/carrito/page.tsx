"use client";

import Navbar from "@/components/Navbar";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";
import BarraEnvioGratis from "@/components/BarraEnvioGratis";
import SugerenciaComplemento from "@/components/SugerenciaComplemento";
import { useCarrito } from "@/context/CarritoContext";

function formatoMXN(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export default function CarritoPage() {
  const { items, actualizarCantidad, eliminarItem, total } = useCarrito();

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-24 px-6 md:px-10 min-h-[60vh]">
        <div className="mx-auto max-w-4xl">
          <span className="eyebrow text-cobre-dim font-bold mb-3">Tu carrito</span>
          <h1 className="font-display font-medium text-3xl md:text-4xl mb-8">
            {items.length === 0 ? "Tu carrito está vacío" : "Revisa tus termazos"}
          </h1>

          {items.length === 0 ? (
            <div>
              <p className="text-grafito/60 mb-6">
                Aún no has agregado ningún termo personalizado.
              </p>
              <a
                href="/personaliza"
                className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-7 py-3.5 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
              >
                Empezar a personalizar →
              </a>
            </div>
          ) : (
            <>
              <BarraEnvioGratis subtotal={total} />

              <div className="divide-y divide-grafito/10 border-t border-b border-grafito/10 mb-8">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex gap-6 items-center">
                    {/* Mini vista previa del diseño */}
                    <div
                      className="h-20 w-14 rounded-[16px_16px_6px_6px] border border-grafito/10 flex items-center justify-center shrink-0"
                      style={{ background: `linear-gradient(180deg, ${item.colorHex}dd, ${item.colorHex})` }}
                    >
                      <span
                        className="text-[8px] text-center px-1"
                        style={{
                          color: item.colorHex === "#FAFAF8" || item.colorHex === "#C4C4C4" ? "#1A1A1A" : "#C4C4C4",
                        }}
                      >
                        {item.texto}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-display text-lg">{item.productoNombre}</h3>
                      <p className="text-sm text-grafito/60">
                        {item.colorNombre} · &ldquo;{item.texto}&rdquo; · {item.fuenteNombre} · {item.posicion}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        className="h-8 w-8 border border-grafito/20 rounded-sm hover:border-cobre transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        className="h-8 w-8 border border-grafito/20 rounded-sm hover:border-cobre transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-28 text-right font-bold">
                      {formatoMXN(item.precioUnitario * item.cantidad)}
                    </div>

                    <button
                      onClick={() => eliminarItem(item.id)}
                      className="text-grafito/40 hover:text-cobre-dim text-sm transition-colors"
                      aria-label="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <SugerenciaComplemento />

              <div className="flex justify-between items-center mb-10">
                <span className="text-grafito/60">Total</span>
                <span className="font-display text-2xl">{formatoMXN(total)}</span>
              </div>

              <a
                href="/checkout"
                className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
              >
                Ir a pagar →
              </a>
            </>
          )}
        </div>
      </section>
      <CtaFinalYFooter />
    </main>
  );
}
