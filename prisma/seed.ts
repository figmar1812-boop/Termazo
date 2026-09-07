// Carga los productos. El Termo 20oz ahora usa 14 FOTOS REALES (no
// generadas por computadora). El Termo 30oz y el Skinny siguen con su
// paleta anterior hasta que tengamos también sus fotos reales.

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

// ===== Termo 30oz y Skinny — paleta anterior (pendiente de fotos reales) =====
const paleta18 = [
  { nombre: "Teal", hex: "#1282a2", archivo: "teal.png" },
  { nombre: "Morado", hex: "#9575dc", archivo: "morado.png" },
  { nombre: "Grafito", hex: "#3f3e46", archivo: "grafito.png" },
  { nombre: "Rojo", hex: "#fa484b", archivo: "rojo.png" },
  { nombre: "Olivo", hex: "#74865b", archivo: "olivo.png" },
  { nombre: "Turquesa", hex: "#3ae0e0", archivo: "turquesa.png" },
  { nombre: "Gris", hex: "#98aaae", archivo: "gris.png" },
  { nombre: "Rosa magenta", hex: "#fd658b", archivo: "rosa-magenta.png" },
  { nombre: "Verde", hex: "#62ce3b", archivo: "verde.png" },
  { nombre: "Azul rey", hex: "#054dae", archivo: "azul-rey.png" },
  { nombre: "Plata/acero", hex: "#bebbb1", archivo: "plata-acero.png" },
  { nombre: "Magenta fuerte", hex: "#de429a", archivo: "magenta-fuerte.png" },
  { nombre: "Verde limón", hex: "#c9df04", archivo: "verde-limon.png" },
  { nombre: "Lavanda", hex: "#c9ddf0", archivo: "lavanda.png" },
  { nombre: "Azul marino", hex: "#29436e", archivo: "azul-marino.png" },
  { nombre: "Rosa claro", hex: "#f7b3c4", archivo: "rosa-claro.png" },
  { nombre: "Naranja", hex: "#fd8308", archivo: "naranja.png" },
  { nombre: "Terracota", hex: "#c3615f", archivo: "terracota.png" },
];

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
        create: paleta18.map((c) => ({
          nombre: c.nombre,
          hex: c.hex,
          imagenUrl: base(`30oz-${c.archivo}`),
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

  console.log("Seed completado: Termo 20oz con 14 fotos reales, 30oz y Skinny con paleta generada.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
