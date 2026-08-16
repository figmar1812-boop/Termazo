const testimonios = [
  { texto: "El grabado se ve exactamente como en la vista previa. No lo esperaba.", autor: "Ana R." },
  { texto: "Pedí 30 para mi equipo con el logo de la empresa, llegaron perfectos.", autor: "Carlos M." },
  { texto: "Se lo regalé a mi papá con su nombre. Lloró un poco, la verdad.", autor: "Sofía T." },
];

export default function Testimonios() {
  return (
    <section className="px-6 md:px-10 py-24 border-b border-grafito/10">
      <div className="mx-auto max-w-7xl">
        <span className="eyebrow text-cobre-dim font-bold mb-10">Lo que dicen</span>
        <div className="grid md:grid-cols-3 gap-10">
          {testimonios.map((t, i) => (
            <div key={i}>
              <p className="font-display text-xl leading-snug mb-4">&ldquo;{t.texto}&rdquo;</p>
              <span className="text-sm text-grafito/60">— {t.autor}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
