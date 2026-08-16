"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useCarrito } from "@/context/CarritoContext";
import { calcularCostoEnvio, ENVIO_CONFIG } from "@/lib/shipping";

type Form = {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  cp: string;
  ciudad: string;
  estado: string;
  pais: string;
  rfc: string;
};

const CAMPOS_REQUERIDOS: (keyof Form)[] = [
  "nombre",
  "email",
  "telefono",
  "direccion",
  "cp",
  "ciudad",
  "estado",
  "pais",
];

function formatoMXN(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export default function CheckoutPage() {
  const { items, total, vaciarCarrito } = useCarrito();
  const costoEnvio = calcularCostoEnvio(total);
  const totalConEnvio = total + costoEnvio;

  const [form, setForm] = useState<Form>({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    cp: "",
    ciudad: "",
    estado: "",
    pais: "México",
    rfc: "",
  });
  const [errores, setErrores] = useState<Partial<Record<keyof Form, string>>>({});
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  function actualizar(campo: keyof Form, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function validar(): boolean {
    const nuevosErrores: Partial<Record<keyof Form, string>> = {};
    for (const campo of CAMPOS_REQUERIDOS) {
      if (!form[campo].trim()) nuevosErrores[campo] = "Este campo es obligatorio";
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nuevosErrores.email = "Correo inválido";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  async function confirmarPedido() {
    if (items.length === 0) return;
    if (!validar()) return;

    setEnviando(true);
    setErrorGeneral(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: { nombre: form.nombre, email: form.email, telefono: form.telefono },
          items: items.map((i) => ({
            productoSlug: i.productoSlug,
            precioUnitario: i.precioUnitario,
            colorNombre: i.colorNombre,
            colorHex: i.colorHex,
            texto: i.texto,
            fuenteNombre: i.fuenteNombre,
            posicion: i.posicion,
            tamano: i.tamano,
            cantidad: i.cantidad,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo crear el pedido");

      // Pedido creado en estado PENDIENTE_PAGO — ahora generamos la
      // preferencia de pago y mandamos al cliente al Checkout de Mercado
      // Pago. El carrito se vacía aquí porque el pedido ya quedó registrado;
      // si el pago falla, el pedido queda como PENDIENTE_PAGO / CANCELADO,
      // pero eso lo decide únicamente el webhook, nunca esta pantalla.
      vaciarCarrito();

      const pagoRes = await fetch("/api/checkout/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroPedido: data.pedido.numeroPedido }),
      });
      const pagoData = await pagoRes.json();
      if (!pagoRes.ok || !pagoData.initPoint) {
        throw new Error(pagoData.error || "No se pudo iniciar el pago");
      }

      window.location.href = pagoData.initPoint;
    } catch (e: any) {
      setErrorGeneral(e.message);
    } finally {
      setEnviando(false);
    }
  }

  const campo = (
    id: keyof Form,
    label: string,
    span2 = false,
    tipo = "text"
  ) => (
    <div className={span2 ? "md:col-span-2" : ""}>
      <label className="text-xs uppercase tracking-widest text-grafito/50 mb-2 block">
        {label}
      </label>
      <input
        type={tipo}
        value={form[id]}
        onChange={(e) => actualizar(id, e.target.value)}
        className={`w-full border rounded-sm px-4 py-3 focus:outline-none focus:border-cobre ${
          errores[id] ? "border-red-400" : "border-grafito/20"
        }`}
      />
      {errores[id] && <p className="text-xs text-red-500 mt-1">{errores[id]}</p>}
    </div>
  );

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-24 px-6 md:px-10">
        <div className="mx-auto max-w-5xl grid md:grid-cols-[1.4fr_1fr] gap-16">
          <div>
            <span className="eyebrow text-cobre-dim font-bold mb-3">Checkout</span>
            <h1 className="font-display font-medium text-3xl md:text-4xl mb-8">
              Datos de envío
            </h1>

            {items.length === 0 ? (
              <p className="text-grafito/60">
                Tu carrito está vacío.{" "}
                <a href="/personaliza" className="text-cobre-dim underline">
                  Empieza a personalizar →
                </a>
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {campo("nombre", "Nombre completo", true)}
                {campo("email", "Correo electrónico", false, "email")}
                {campo("telefono", "Teléfono", false, "tel")}
                {campo("direccion", "Dirección", true)}
                {campo("cp", "Código postal")}
                {campo("ciudad", "Ciudad")}
                {campo("estado", "Estado")}
                {campo("pais", "País")}
                <div className="md:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-grafito/50 mb-2 block">
                    RFC (opcional, para factura)
                  </label>
                  <input
                    type="text"
                    value={form.rfc}
                    onChange={(e) => actualizar("rfc", e.target.value)}
                    className="w-full border border-grafito/20 rounded-sm px-4 py-3 focus:outline-none focus:border-cobre"
                  />
                </div>
              </div>
            )}

            {errorGeneral && (
              <p className="text-sm text-red-500 mt-4">{errorGeneral}</p>
            )}

            {items.length > 0 && (
              <button
                onClick={confirmarPedido}
                disabled={enviando}
                className="mt-10 inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors disabled:opacity-50"
              >
                {enviando ? "Procesando..." : "Confirmar pedido →"}
              </button>
            )}
            <p className="text-xs text-grafito/40 mt-3">
              El pago con tarjeta (Mercado Pago) se conecta en la Fase 12 — por
              ahora este botón crea el pedido directamente.
            </p>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-hueso border border-grafito/10 p-6 h-fit sticky top-24">
            <h2 className="font-display text-xl mb-6">Resumen</h2>
            <div className="divide-y divide-grafito/10">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between text-sm">
                  <span className="text-grafito/70">
                    {item.productoNombre} × {item.cantidad}
                  </span>
                  <span className="font-bold">
                    {formatoMXN(item.precioUnitario * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4 mt-2 border-t border-grafito/10 text-sm">
              <span className="text-grafito/60">Subtotal</span>
              <span>{formatoMXN(total)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-grafito/60">Envío</span>
              <span>{costoEnvio === 0 ? "Gratis" : formatoMXN(costoEnvio)}</span>
            </div>
            {costoEnvio > 0 && (
              <p className="text-xs text-grafito/40 mt-1">
                Envío gratis en compras desde {formatoMXN(ENVIO_CONFIG.envioGratisDesde)}
              </p>
            )}
            <div className="flex justify-between pt-3 mt-2 border-t border-grafito/10">
              <span className="font-bold">Total</span>
              <span className="font-display text-xl">{formatoMXN(totalConEnvio)}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
