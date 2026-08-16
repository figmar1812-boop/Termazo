export default function CtaFinalYFooter() {
  return (
    <>
      <section className="px-6 md:px-10 py-28 bg-grafito text-hueso text-center">
        <span className="eyebrow justify-center text-plata mb-6">Empieza hoy</span>
        <h2 className="font-display font-medium text-4xl md:text-5xl max-w-xl mx-auto mb-8">
          ¿Listo para tu Termazo?
        </h2>
        <a
          href="/personaliza"
          className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-9 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
        >
          Personalizar mi termo →
        </a>
      </section>
      <footer className="px-6 md:px-10 py-10 bg-grafito text-plata text-xs flex flex-col md:flex-row gap-3 justify-between border-t border-hueso/10">
        <span>© 2026 Termazo. Todos los derechos reservados.</span>
        <span>No es cualquier termo. Es tu Termazo.</span>
      </footer>
    </>
  );
}
