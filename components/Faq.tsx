const preguntas = [
  { p: "¿Cuánto tarda el grabado?", r: "Entre 2 y 4 días hábiles antes de enviarse, dependiendo de la carga de pedidos." },
  { p: "¿Puedo subir mi propio logo?", r: "Sí, aceptamos PNG, JPG y SVG. Nuestro equipo revisa cada logo antes de grabarlo." },
  { p: "¿El grabado se puede borrar?", r: "No. Es grabado láser real sobre el metal, no una impresión ni una calcomanía." },
  { p: "¿Hacen envíos a todo México?", r: "Sí, envíos a toda la república. Pronto integraremos más paqueterías." },
];

export default function Faq() {
  return (
    <section className="px-6 md:px-10 py-24 bg-hueso border-b border-grafito/10">
      <div className="mx-auto max-w-7xl grid md:grid-cols-[1fr_2fr] gap-14">
        <h2 className="font-display font-medium text-3xl md:text-4xl">
          Preguntas frecuentes
        </h2>
        <div className="divide-y divide-grafito/10">
          {preguntas.map((f, i) => (
            <div key={i} className="py-6">
              <h3 className="font-display text-lg mb-2">{f.p}</h3>
              <p className="text-sm text-grafito/65 max-w-xl">{f.r}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
