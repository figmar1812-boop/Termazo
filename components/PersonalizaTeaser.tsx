export default function PersonalizaTeaser() {
  return (
    <section className="px-6 md:px-10 py-24 bg-grafito text-hueso border-b border-hueso/10">
      <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="eyebrow text-plata mb-4">El personalizador</span>
          <h2 className="font-display font-medium text-3xl md:text-4xl mb-5">
            Tu nombre, grabado tal como lo imaginas.
          </h2>
          <p className="text-plata max-w-md mb-8">
            Elige color, escribe tu texto, sube tu logo, cambia la tipografía
            y la posición. Ves el resultado grabado antes de comprar — sin
            sorpresas.
          </p>
          <a
            href="/personaliza"
            className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-7 py-3.5 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
          >
            Abrir el personalizador →
          </a>
        </div>
        <div className="bg-[#111] border border-hueso/10 rounded-sm p-10 flex items-center justify-center">
          <div className="h-64 w-32 rounded-[50px_50px_14px_14px] bg-gradient-to-b from-[#2b2b2b] to-[#171717] border border-plata/15 flex items-center justify-center">
            <div className="text-center">
              <p className="font-display text-plata text-lg">CHRISTIAN</p>
              <div className="w-8 h-px bg-cobre mx-auto my-2" />
              <p className="text-[10px] tracking-widest text-plata/70">EST. 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
