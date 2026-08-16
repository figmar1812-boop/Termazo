// Lógica de negocio para precios por volumen (punto 29 del brief original).
// Los rangos y descuentos son configurables aquí — en la Fase 15 (panel admin)
// esto se moverá a la base de datos para que se pueda editar sin tocar código.

export type TierPrecio = { min: number; max: number | null; descuento: number };

export const TIERS_PRECIO: TierPrecio[] = [
  { min: 1, max: 5, descuento: 0 },
  { min: 6, max: 15, descuento: 0.05 },
  { min: 16, max: 25, descuento: 0.1 },
  { min: 26, max: 50, descuento: 0.15 },
  { min: 51, max: 100, descuento: 0.2 },
  { min: 101, max: null, descuento: 0.25 },
];

export function precioConDescuento(precioBase: number, cantidad: number): number {
  const tier =
    TIERS_PRECIO.find((t) => cantidad >= t.min && (t.max === null || cantidad <= t.max)) ??
    TIERS_PRECIO[0];
  const precioUnitario = precioBase * (1 - tier.descuento);
  return Math.round(precioUnitario);
}

export function calcularTotalPedido(
  items: { precioUnitario: number; cantidad: number }[]
): number {
  return items.reduce((acc, i) => acc + precioConDescuento(i.precioUnitario, i.cantidad) * i.cantidad, 0);
}
