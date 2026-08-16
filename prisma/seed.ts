// Carga los productos iniciales a la base de datos.
// Se ejecuta una sola vez (o cada vez que quieras resetear el catálogo) con:
//   npx prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        create: [
          { nombre: "Grafito", hex: "#1A1A1A" },
          { nombre: "Plata", hex: "#C4C4C4" },
          { nombre: "Blanco hueso", hex: "#FAFAF8" },
          { nombre: "Cobre", hex: "#D4763A" },
        ],
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
        create: [
          { nombre: "Grafito", hex: "#1A1A1A" },
          { nombre: "Plata", hex: "#C4C4C4" },
          { nombre: "Blanco hueso", hex: "#FAFAF8" },
        ],
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
        create: [
          { nombre: "Grafito", hex: "#1A1A1A" },
          { nombre: "Cobre", hex: "#D4763A" },
        ],
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

  console.log("Seed completado: 3 productos, colores y fuentes cargados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
