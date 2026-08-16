const ideas = ["Nombres", "Monogramas", "Frases", "Profesiones", "Minimalista", "Corporativo", "Regalos"];

export default function Inspiracion() {
  return (
    <section className="px-6 md:px-10 py-24 border-b border-grafito/10">
      <div className="mx-auto max-w-7xl">
        <span className="eyebrow text-cobre-dim font-bold mb-4">Inspiración</span>
        <h2 className="font-display font-medium text-3xl md:text-4xl max-w-xl mb-10">
          ¿No sabes qué grabar? Aquí tienes ideas.
        </h2>
        <div className="flex flex-wrap gap-3">
          {ideas.map((i) => (
            <a
              key={i}
              href="/inspiracion"
              className="px-5 py-2.5 border border-grafito/15 rounded-full text-sm hover:border-cobre hover:text-cobre-dim transition-colors"
            >
              {i}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
