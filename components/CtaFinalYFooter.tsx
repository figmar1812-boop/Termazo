const COLUMNA_PRODUCTOS = [
  { href: "/termos", label: "Termos" },
  { href: "/personaliza", label: "Personaliza" },
  { href: "/kits", label: "Kits" },
  { href: "/regalos", label: "Regalos" },
];

const COLUMNA_EMPRESA = [
  { href: "/empresas", label: "Empresas" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/nosotros#contacto", label: "Contacto" },
  { href: "/nosotros#faq", label: "Preguntas frecuentes" },
];

const COLUMNA_AYUDA = [
  { href: "/nosotros#envios", label: "Envíos" },
  { href: "/nosotros#pagos", label: "Métodos de pago" },
  { href: "/nosotros#cambios", label: "Cambios y devoluciones" },
  { href: "/nosotros#terminos", label: "Términos y condiciones" },
  { href: "/nosotros#privacidad", label: "Aviso de privacidad" },
];

// Deja aquí tu usuario/URL real de cada red en cuanto la tengas — por ahora
// se muestran sin enlace para no apuntar a nada inventado.
const REDES = [
  { label: "Instagram", href: "" },
  { label: "Facebook", href: "" },
  { label: "TikTok", href: "" },
  { label: "WhatsApp", href: "" },
];

export default function CtaFinalYFooter() {
  return (
    <>
      <section className="px-6 md:px-10 py-28 bg-grafito text-hueso text-center">
        <span className="eyebrow justify-center text-plata mb-6">Empieza hoy</span>
        <h2 className="font-display font-medium text-4xl md:text-5xl max-w-xl mx-auto mb-4 uppercase">
          ¿Listo para hacerlo tuyo?
        </h2>
        <p className="text-plata max-w-md mx-auto mb-8">
          Personaliza tu Termazo y mira cómo quedará antes de comprar.
        </p>
        <a
          href="/personaliza"
          className="inline-flex items-center gap-3 bg-cobre text-grafito font-bold px-9 py-4 rounded-sm text-sm hover:bg-cobre-dim transition-colors"
        >
          Personaliza ahora →
        </a>
      </section>

      <footer className="bg-grafito text-plata border-t border-hueso/10">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-navbar.png" alt="Termazo" className="h-10 w-auto mb-4" />
            <p className="text-sm text-plata/80 max-w-[220px]">
              Personaliza lo que te representa.
            </p>
          </div>

          <div>
            <h3 className="text-hueso text-xs font-bold uppercase tracking-widest mb-4">Productos</h3>
            <ul className="flex flex-col gap-2.5">
              {COLUMNA_PRODUCTOS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm hover:text-hueso transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-hueso text-xs font-bold uppercase tracking-widest mb-4">Empresa</h3>
            <ul className="flex flex-col gap-2.5">
              {COLUMNA_EMPRESA.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm hover:text-hueso transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-hueso text-xs font-bold uppercase tracking-widest mb-4">Ayuda</h3>
            <ul className="flex flex-col gap-2.5">
              {COLUMNA_AYUDA.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm hover:text-hueso transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10 pb-8">
          <div className="flex flex-wrap gap-4 mb-8">
            {REDES.map((r) =>
              r.href ? (
                <a
                  key={r.label}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs border border-hueso/15 rounded-full px-4 py-2 hover:border-cobre hover:text-hueso transition-colors"
                >
                  {r.label}
                </a>
              ) : (
                <span
                  key={r.label}
                  title="Próximamente"
                  className="text-xs border border-hueso/10 text-plata/40 rounded-full px-4 py-2"
                >
                  {r.label}
                </span>
              )
            )}
          </div>

          <div className="pt-6 border-t border-hueso/10 text-xs flex flex-col md:flex-row gap-3 justify-between">
            <span>© 2026 Termazo. Todos los derechos reservados.</span>
            <span>No es cualquier termo. Es tu Termazo.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
