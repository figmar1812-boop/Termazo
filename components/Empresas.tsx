export default function Empresas() {
  return (
    <section className="px-6 md:px-10 py-24 bg-grafito text-hueso border-b border-hueso/10">
      <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="eyebrow text-plata mb-4">Para empresas</span>
          <h2 className="font-display font-medium text-3xl md:text-4xl mb-4">
            Termos personalizados para empresas
          </h2>
          <p className="text-plata max-w-md">
            Regalos corporativos, eventos, onboarding de nuevos colaboradores.
            Pedidos desde 10 piezas con tu logo grabado.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 items-center md:justify-end">
          {["10", "25", "50", "100+"].map((n) => (
            <span key={n} className="border border-hueso/20 px-4 py-2 text-sm text-plata rounded-full">
              {n} piezas
            </span>
          ))}
          <a
            href="/empresas"
            className="bg-cobre text-grafito font-bold px-6 py-3 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
          >
            Solicitar cotización
          </a>
        </div>
      </div>
    </section>
  );
}
