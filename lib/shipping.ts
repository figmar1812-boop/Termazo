// Envíos — versión inicial con tarifa fija configurable (punto 25 del brief).
// Cuando integremos paqueterías reales (Estafeta, DHL, FedEx, Redpack), esta
// función es el único lugar que cambia: en vez de devolver un número fijo,
// llamará a la API de la paquetería con el CP del cliente y el peso del
// pedido. El resto del código (checkout, pedido, Mercado Pago) no cambia,
// porque todos consumen el resultado de esta función, no un número fijo.

export const ENVIO_CONFIG = {
  tarifaFija: 120, // MXN
  envioGratisDesde: 1200, // MXN — subtotal a partir del cual el envío es gratis
};

export function calcularCostoEnvio(subtotal: number): number {
  if (subtotal >= ENVIO_CONFIG.envioGratisDesde) return 0;
  return ENVIO_CONFIG.tarifaFija;
}

export function envioEsGratis(subtotal: number): boolean {
  return subtotal >= ENVIO_CONFIG.envioGratisDesde;
}
