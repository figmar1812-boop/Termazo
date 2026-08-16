const PREGUNTAS = [
  { p: "¿Cómo sé que el grabado quedará bien?", r: "Ves una vista previa realista antes de pagar, y revisamos cada diseño antes de grabarlo." },
  { p: "¿Qué pasa si no me gusta el resultado?", r: "Si el grabado no coincide con lo que aprobaste, lo hacemos de nuevo sin costo." },
  { p: "¿Cuánto tarda en llegar?", r: "2-4 días de producción, más el tiempo de envío según tu ciudad." },
];

export default function FaqProducto() {
  return (
    <section className="mt-12 pt-10 border-t border-grafito/10">
      <h2 className="font-display text-2xl mb-6">Preguntas frecuentes</h2>
      <div className="divide-y divide-grafito/10">
        {PREGUNTAS.map((f, i) => (
          <div key={i} className="py-4">
            <h3 className="font-semibold text-sm mb-1">{f.p}</h3>
            <p className="text-sm text-grafito/60">{f.r}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
