export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grafito text-hueso pt-40 pb-20 px-6 md:px-10">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,118,58,0.25), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="eyebrow text-plata mb-6">Grabado láser real</span>
          <h1 className="font-display font-medium text-[42px] leading-[0.98] md:text-[72px] uppercase -tracking-[0.01em]">
            No es cualquier termo.
            <br />
            Es tu <span className="text-cobre">Termazo.</span>
          </h1>
          <p className="mt-7 max-w-md text-plata text-lg">
            Elige tu termo, personalízalo con tu nombre, frase o logo, y velo
            grabado antes de comprarlo.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="/personaliza"
              className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
            >
              Personaliza mi Termazo →
            </a>
            <a
              href="/termos"
              className="inline-flex items-center gap-2 text-plata text-sm font-semibold border border-hueso/20 px-6 py-4 rounded-sm hover:border-hueso/50 hover:text-hueso transition-colors"
            >
              Ver termos
            </a>
          </div>
        </div>

        {/* Termo real con grabado simulado */}
        <div className="relative flex items-center justify-center">
          <div className="absolute top-4 right-4 md:right-8 z-10 bg-hueso/95 text-grafito text-[10px] font-bold uppercase tracking-widest px-3 py-2 rounded-sm leading-tight text-center">
            Grabado láser
            <br />
            Hecho en México
          </div>
          <div className="relative w-full max-w-[360px] aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/wdv1yp1u/image/upload/20oz-negro.png"
              alt="Termo Termazo personalizado con grabado láser"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ filter: "drop-shadow(0 30px 34px rgba(0,0,0,0.45))" }}
            />
            <div
              className="absolute text-center pointer-events-none select-none"
              style={{
                top: "52%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "clamp(20px, 4vw, 30px)",
                letterSpacing: "0.03em",
                color: "#E9EBEE",
                textShadow:
                  "0 0 6px rgba(255,255,255,0.5), 0 1px 1px rgba(0,0,0,0.45), 0 -0.5px 0 rgba(255,255,255,0.35)",
              }}
            >
              Christian
            </div>
          </div>
        </div>
      </div>

      {/* Beneficios inmediatos */}
      <div className="relative mx-auto max-w-7xl mt-20 pt-10 border-t border-hueso/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-plata">
        <div className="flex items-center gap-3">
          <span className="text-cobre text-lg">✓</span> Grabado láser real
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cobre text-lg">✓</span> Vista previa antes de comprar
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cobre text-lg">✓</span> Envíos a todo México
        </div>
      </div>
    </section>
  );
}
