export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grafito text-hueso pt-40 pb-28 px-6 md:px-10">
      <div
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,118,58,0.25), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <span className="eyebrow text-plata mb-6">Grabado láser · Hecho en México</span>
        <h1 className="font-display font-medium text-[46px] leading-[0.98] md:text-[84px] max-w-4xl -tracking-[0.01em]">
          No es cualquier termo.
          <br />
          Es tu <span className="text-cobre">Termazo.</span>
        </h1>
        <p className="mt-7 max-w-md text-plata text-lg">
          Elige tu termo, personalízalo con tu nombre, frase o logo, y velo
          grabado antes de comprarlo.
        </p>
        <a
          href="/personaliza"
          className="mt-10 inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-8 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
        >
          Personalizar mi termo →
        </a>
      </div>
    </section>
  );
}
