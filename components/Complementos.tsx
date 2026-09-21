const complementos = [
  { nombre: "Portalata 4 en 1", slug: "portalata-4en1" },
  { nombre: "Vinero", slug: "vinero" },
  { nombre: "Taza 350 ml", slug: "taza-350ml" },
];

export default function Complementos() {
  return (
    <section className="px-6 md:px-10 py-24 bg-hueso border-b border-grafito/10">
      <div className="mx-auto max-w-7xl">
        <span className="eyebrow text-cobre-dim font-bold mb-4">Complementos</span>
        <h2 className="font-display font-medium text-3xl md:text-4xl max-w-xl mb-3 uppercase">
          Completa tu set.
        </h2>
        <p className="text-grafito/60 max-w-md mb-10">
          Combina tu Termazo con accesorios diseñados para acompañarlo.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {complementos.map((c) => (
            <a
              key={c.slug}
              href={`/complementos/${c.slug}`}
              className="border border-grafito/10 p-6 flex items-center justify-between hover:border-cobre transition-colors"
            >
              <span className="font-display text-lg">{c.nombre}</span>
              <span className="text-cobre-dim text-sm">Ver producto →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
