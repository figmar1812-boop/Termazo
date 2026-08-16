// NOTA: estas reseñas son contenido de ejemplo (placeholder) para que la
// página se vea completa desde ahora. En cuanto tengas tus primeras ventas
// reales, esto se reemplaza por un modelo `Review` real en la base de datos
// (calificación, texto, foto opcional, ligado al pedido) — es una extensión
// pequeña sobre el esquema que ya tenemos, se puede construir cuando quieras.
const RESENAS_EJEMPLO = [
  {
    nombre: "Ana R.",
    texto: "El grabado se ve exactamente como en la vista previa. Se lo regalé a mi hermana y quedó encantada.",
    estrellas: 5,
  },
  {
    nombre: "Carlos M.",
    texto: "Pedí varios con el logo de mi equipo de trabajo, llegaron parejos y a tiempo.",
    estrellas: 5,
  },
  {
    nombre: "Sofía T.",
    texto: "Muy buena calidad del metal, y el grabado no se ha desgastado después de meses de uso diario.",
    estrellas: 5,
  },
];

export default function ResenasProducto() {
  return (
    <section className="mt-16 pt-10 border-t border-grafito/10">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="font-display text-2xl">Lo que dicen quienes ya compraron</h2>
        <span className="text-cobre-dim text-sm">★★★★★</span>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {RESENAS_EJEMPLO.map((r, i) => (
          <div key={i}>
            <div className="text-cobre-dim text-sm mb-2">
              {"★".repeat(r.estrellas)}
            </div>
            <p className="text-sm text-grafito/70 mb-3">&ldquo;{r.texto}&rdquo;</p>
            <span className="text-xs text-grafito/50 font-semibold">— {r.nombre}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
