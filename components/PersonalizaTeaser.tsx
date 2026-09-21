export default function PersonalizaTeaser() {
  return (
    <section className="px-6 md:px-10 py-24 bg-grafito text-hueso border-b border-hueso/10">
      <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-14 items-center">
        <div>
          <span className="eyebrow text-plata mb-4">El personalizador</span>
          <h2 className="font-display font-medium text-3xl md:text-4xl mb-5 uppercase leading-[1.05]">
            Tu nombre.
            <br />
            Tu diseño.
            <br />
            Tu Termazo.
          </h2>
          <p className="text-plata max-w-md mb-8">
            Personaliza tu termo, visualiza el grabado y compra con la
            seguridad de saber exactamente cómo quedará.
          </p>
          <a
            href="/personaliza"
            className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-7 py-3.5 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
          >
            Personalizar mi Termazo →
          </a>
        </div>
        <div className="bg-[#111] border border-hueso/10 rounded-sm p-10 flex items-center justify-center">
          <div className="relative w-full max-w-[220px] aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/wdv1yp1u/image/upload/20oz-negro.png"
              alt="Vista previa del personalizador Termazo"
              className="absolute inset-0 w-full h-full object-contain"
              style={{ filter: "drop-shadow(0 20px 22px rgba(0,0,0,0.5))" }}
            />
            <div
              className="absolute text-center pointer-events-none select-none"
              style={{
                top: "52%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "18px",
                letterSpacing: "0.03em",
                color: "#E9EBEE",
                textShadow:
                  "0 0 5px rgba(255,255,255,0.5), 0 1px 1px rgba(0,0,0,0.45), 0 -0.5px 0 rgba(255,255,255,0.35)",
              }}
            >
              Christian
              <div className="w-8 h-px bg-cobre mx-auto my-1.5 opacity-80" />
              <span className="text-[9px] tracking-widest opacity-80">EST. 2026</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
