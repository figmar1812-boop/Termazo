// NOTA: los productos ahora viven en la base de datos real (Fase 9).
// Ver lib/db-products.ts para las funciones que los consultan vía Prisma.
// Este archivo conserva solo los tipos y el catálogo de fuentes (que no
// depende de datos por producto).

export type Termo = {
  slug: string;
  nombre: string;
  precio: string;
  desde: number;
  desc: string;
  detalle: string;
  colores: { nombre: string; hex: string }[];
  zonaGrabado: { top: number; bottom: number; left: number; right: number };
};

export type Fuente = {
  id: string;
  nombre: string;
  cssFamily: string;
};

export const fuentes: Fuente[] = [
  { id: "elegant", nombre: "Elegant", cssFamily: "'Playfair Display', serif" },
  { id: "modern", nombre: "Modern", cssFamily: "'Manrope', sans-serif" },
  { id: "classic", nombre: "Classic", cssFamily: "'Fraunces', serif" },
  { id: "script", nombre: "Script", cssFamily: "'Dancing Script', cursive" },
  { id: "minimal", nombre: "Minimal", cssFamily: "'Manrope', sans-serif" },
];
