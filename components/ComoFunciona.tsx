const pasos = [
  {
    n: "01",
    icono: "🧴",
    titulo: "Elige tu termo",
    texto: "20 oz, 30 oz o Skinny 20 oz, en el color que va contigo.",
  },
  {
    n: "02",
    icono: "✏️",
    titulo: "Personalízalo",
    texto: "Nombre, frase o logo. Elige tipografía, tamaño y posición.",
  },
  {
    n: "03",
    icono: "👀",
    titulo: "Míralo grabado",
    texto: "Vista previa real del grabado láser antes de pagar.",
  },
  {
    n: "04",
    icono: "📦",
    titulo: "Recíbelo",
    texto: "Lo grabamos y te lo enviamos a donde estés.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="px-6 md:px-10 py-24 border-b border-grafito/10">
      <div className="mx-auto max-w-7xl">
        <span className="eyebrow text-cobre-dim font-bold mb-4">Cómo funciona</span>
        <h2 className="font-display font-medium text-3xl md:text-4xl max-w-xl mb-14">
          De la idea al grabado, en cuatro pasos.
        </h2>
        <div className="grid md:grid-cols-4 gap-10">
          {pasos.map((p) => (
            <div key={p.n} className="border-t border-grafito/15 pt-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-cobre font-display text-2xl">{p.n}</span>
                <span className="text-2xl opacity-70">{p.icono}</span>
              </div>
              <h3 className="font-display text-xl mt-3 mb-2">{p.titulo}</h3>
              <p className="text-sm text-grafito/70">{p.texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
