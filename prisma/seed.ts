// Carga los productos. Termo 20oz (14 fotos reales) y Termo 30oz (13 fotos
// reales) ya usan fotos de verdad. El Skinny sigue con su paleta generada
// hasta que tengamos también sus fotos reales.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CLOUD = "wdv1yp1u";
const base = (archivo: string) =>
  `https://res.cloudinary.com/${CLOUD}/image/upload/${archivo}`;

// ===== Termo 20oz — fotos reales =====
const colores20oz = [
  { nombre: "Amarillo", hex: "#f2e159", archivo: "20oz-amarillo.png" },
  { nombre: "Azul marino", hex: "#2e3346", archivo: "20oz-azul-marino.png" },
  { nombre: "Azul rey", hex: "#314f8e", archivo: "20oz-azul-rey.png" },
  { nombre: "Blanco", hex: "#dcdce6", archivo: "20oz-blanco.png" },
  { nombre: "Gris", hex: "#75767d", archivo: "20oz-gris.png" },
  { nombre: "Magenta fuerte", hex: "#a33865", archivo: "20oz-magenta-fuerte.png" },
  { nombre: "Morado", hex: "#8a69a8", archivo: "20oz-morado.png" },
  { nombre: "Naranja", hex: "#f57b14", archivo: "20oz-naranja.png" },
  { nombre: "Negro", hex: "#28272a", archivo: "20oz-negro.png" },
  { nombre: "Olivo", hex: "#575c4c", archivo: "20oz-olivo.png" },
  { nombre: "Rojo", hex: "#b32b2a", archivo: "20oz-rojo.png" },
  { nombre: "Rosa", hex: "#e1a7b2", archivo: "20oz-rosa.png" },
  { nombre: "Turquesa", hex: "#75c4d1", archivo: "20oz-turquesa.png" },
  { nombre: "Verde", hex: "#50b53f", archivo: "20oz-verde.png" },
];

// ===== Termo 30oz — fotos reales =====
const colores30oz = [
  { nombre: "Amarillo", hex: "#fdef33", archivo: "30oz-amarillo.png" },
  { nombre: "Azul marino", hex: "#2c344c", archivo: "30oz-azul-marino.png" },
  { nombre: "Azul rey", hex: "#214392", archivo: "30oz-azul-rey.png" },
  { nombre: "Blanco", hex: "#ebecef", archivo: "30oz-blanco.png" },
  { nombre: "Magenta fuerte", hex: "#b5295c", archivo: "30oz-magenta-fuerte.png" },
  { nombre: "Morado", hex: "#a36bc6", archivo: "30oz-morado.png" },
  { nombre: "Naranja", hex: "#e24c14", archivo: "30oz-naranja.png" },
  { nombre: "Negro", hex: "#25262c", archivo: "30oz-negro.png" },
  { nombre: "Olivo", hex: "#474b26", archivo: "30oz-olivo.png" },
  { nombre: "Rojo", hex: "#d72f24", archivo: "30oz-rojo.png" },
  { nombre: "Rosa", hex: "#fda4a3", archivo: "30oz-rosa.png" },
  { nombre: "Turquesa", hex: "#67deda", archivo: "30oz-turquesa.png" },
  { nombre: "Verde", hex: "#61c228", archivo: "30oz-verde.png" },
];

// ===== Skinny — paleta generada (pendiente de fotos reales) =====
const paletaSkinny = [
  { nombre: "Coral", hex: "#d54e72", archivo: "coral.png" },
  { nombre: "Teal oscuro", hex: "#0b2230", archivo: "teal-oscuro.png" },
  { nombre: "Lavanda", hex: "#b3b8d2", archivo: "lavanda.png" },
  { nombre: "Negro azulado", hex: "#090913", archivo: "negro-azulado.png" },
  { nombre: "Turquesa", hex: "#42acb0", archivo: "turquesa.png" },
  { nombre: "Azul marino", hex: "#0c1d51", archivo: "azul-marino.png" },
  { nombre: "Marrón vino", hex: "#521a1a", archivo: "marron-vino.png" },
  { nombre: "Verde limón", hex: "#a8b60e", archivo: "verde-limon.png" },
  { nombre: "Rosa", hex: "#d595a9", archivo: "rosa.png" },
  { nombre: "Rojo", hex: "#a8373d", archivo: "rojo.png" },
  { nombre: "Olivo oscuro", hex: "#2d321c", archivo: "olivo-oscuro.png" },
  { nombre: "Naranja", hex: "#e47928", archivo: "naranja.png" },
  { nombre: "Morado", hex: "#5a3c7d", archivo: "morado.png" },
  { nombre: "Verde", hex: "#4a8a1a", archivo: "verde.png" },
  { nombre: "Gris", hex: "#4d4b4c", archivo: "gris.png" },
  { nombre: "Magenta/morado", hex: "#7f265a", archivo: "magenta-morado.png" },
  { nombre: "Negro", hex: "#0f0f11", archivo: "negro.png" },
];

async function main() {
  await prisma.product.deleteMany();

  await prisma.product.create({
    data: {
      slug: "termo-20oz",
      nombre: "Termo 20 oz",
      descripcion: "El clásico. Perfecto para uso diario.",
      precioBase: 450,
      zonaTop: 12,
      zonaBottom: 88,
      zonaLeft: 5,
      zonaRight: 95,
      colores: {
        create: colores20oz.map((c) => ({
          nombre: c.nombre,
          hex: c.hex,
          imagenUrl: base(c.archivo),
        })),
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "termo-30oz",
      nombre: "Termo 30 oz",
      descripcion: "Más capacidad, mismo grabado impecable.",
      precioBase: 550,
      zonaTop: 10,
      zonaBottom: 90,
      zonaLeft: 5,
      zonaRight: 95,
      colores: {
        create: colores30oz.map((c) => ({
          nombre: c.nombre,
          hex: c.hex,
          imagenUrl: base(c.archivo),
        })),
      },
    },
  });

  await prisma.product.create({
    data: {
      slug: "skinny-20oz",
      nombre: "Skinny 20 oz",
      descripcion: "Silueta delgada, cabe en cualquier portavasos.",
      precioBase: 480,
      zonaTop: 15,
      zonaBottom: 85,
      zonaLeft: 6,
      zonaRight: 94,
      colores: {
        create: paletaSkinny.map((c) => ({
          nombre: c.nombre,
          hex: c.hex,
          imagenUrl: base(`skinny-${c.archivo}`),
        })),
      },
    },
  });

  await prisma.font.createMany({
    data: [
      { nombre: "Elegant", cssFamily: "'Playfair Display', serif" },
      { nombre: "Modern", cssFamily: "'Manrope', sans-serif" },
      { nombre: "Classic", cssFamily: "'Fraunces', serif" },
      { nombre: "Script", cssFamily: "'Dancing Script', cursive" },
      { nombre: "Minimal", cssFamily: "'Manrope', sans-serif" },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completado: 20oz y 30oz con fotos reales, Skinny con paleta generada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
