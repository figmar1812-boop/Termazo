"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import CtaFinalYFooter from "@/components/CtaFinalYFooter";

const ESTADOS_LABEL: Record<string, string> = {
  PENDIENTE_PAGO: "Pendiente de pago",
  PAGADO: "Pagado",
  EN_PRODUCCION: "En producción",
  GRABADO: "Grabado",
  EMPACADO: "Empacado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

export default function PedidoConfirmadoPage() {
  const params = useSearchParams();
  const numeroPedido = params.get("pedido");
  const [pedido, setPedido] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!numeroPedido) {
      setCargando(false);
      setError("No se especificó un número de pedido.");
      return;
    }
    fetch(`/api/orders/${numeroPedido}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPedido(data.pedido);
      })
      .catch(() => setError("No se pudo consultar el pedido."))
      .finally(() => setCargando(false));
  }, [numeroPedido]);

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-24 px-6 md:px-10 min-h-[60vh]">
        <div className="mx-auto max-w-2xl">
          {cargando && <p className="text-grafito/60">Consultando tu pedido...</p>}

          {!cargando && error && (
            <div>
              <h1 className="font-display text-3xl mb-4">No encontramos ese pedido</h1>
              <p className="text-grafito/60 mb-6">{error}</p>
              <a href="/personaliza" className="text-cobre-dim underline">
                Volver a personalizar →
              </a>
            </div>
          )}

          {!cargando && pedido && (
            <div>
              <span className="eyebrow text-cobre-dim font-bold mb-4">Pedido confirmado</span>
              <h1 className="font-display font-medium text-3xl md:text-4xl mb-3">
                ¡Gracias por tu compra!
              </h1>
              <p className="text-grafito/60 mb-10">
                Número de pedido: <span className="font-bold text-grafito">{pedido.numeroPedido}</span>
              </p>

              <div className="border border-grafito/10 p-6 mb-8">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-grafito/60">Estado</span>
                  <span className="text-sm font-bold">{ESTADOS_LABEL[pedido.estado]}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-grafito/60">Subtotal</span>
                  <span className="text-sm">${pedido.subtotal} MXN</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-grafito/60">Envío</span>
                  <span className="text-sm">
                    {pedido.costoEnvio === 0 ? "Gratis" : `$${pedido.costoEnvio} MXN`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-grafito/10">
                  <span className="text-sm font-bold">Total</span>
                  <span className="text-sm font-bold">${pedido.total} MXN</span>
                </div>
              </div>

              <div className="divide-y divide-grafito/10 border-t border-grafito/10 mb-10">
                {pedido.items.map((item: any) => (
                  <div key={item.id} className="py-4 flex justify-between text-sm">
                    <span>
                      {item.product?.nombre} · &ldquo;{item.texto}&rdquo; · {item.colorNombre} × {item.cantidad}
                    </span>
                    <span className="font-bold">${item.precioUnitario * item.cantidad} MXN</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-grafito/60">
                Te enviaremos actualizaciones por email a medida que tu termazo avance por producción.
              </p>
            </div>
          )}
        </div>
      </section>
      <CtaFinalYFooter />
    </main>
  );
}
