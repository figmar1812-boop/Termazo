import { ENVIO_CONFIG, calcularCostoEnvio } from "@/lib/shipping";

function formatoMXN(n: number) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

export default function BarraEnvioGratis({ subtotal }: { subtotal: number }) {
  const costoEnvio = calcularCostoEnvio(subtotal);
  const meta = ENVIO_CONFIG.envioGratisDesde;
  const progreso = Math.min(100, (subtotal / meta) * 100);
  const faltante = Math.max(0, meta - subtotal);

  return (
    <div className="mb-8 bg-hueso border border-grafito/10 p-4 rounded-sm">
      <p className="text-sm mb-2">
        {costoEnvio === 0 ? (
          <span className="text-cobre-dim font-semibold">
            ¡Ya tienes envío gratis! 🎉
          </span>
        ) : (
          <>
            Te faltan <span className="font-bold">{formatoMXN(faltante)}</span> para
            envío gratis
          </>
        )}
      </p>
      <div className="h-1.5 bg-grafito/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-cobre transition-all duration-300"
          style={{ width: `${progreso}%` }}
        />
      </div>
    </div>
  );
}
