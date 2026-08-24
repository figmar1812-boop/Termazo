import Link from "next/link";
import { Termo } from "@/lib/products";

export default function ProductCard({ t }: { t: Termo }) {
  const colorPrincipal = t.colores[0];

  return (
    <Link
      href={`/${t.slug}`}
      className="group block border border-grafito/10 hover:border-cobre transition-colors"
    >
      <div className="aspect-[4/5] bg-grafito flex items-center justify-center overflow-hidden">
        {colorPrincipal?.imagenUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={colorPrincipal.imagenUrl}
            alt={`${t.nombre} — ${colorPrincipal.nombre}`}
            className="h-full w-full object-contain p-6"
          />
        ) : (
          <div
            className="h-3/5 w-1/3 rounded-[60px_60px_16px_16px] border border-plata/15"
            style={{ background: `linear-gradient(180deg, ${colorPrincipal?.hex ?? "#333"}dd, ${colorPrincipal?.hex ?? "#333"})` }}
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl">{t.nombre}</h3>
        <p className="text-sm text-grafito/60 mt-1 mb-3">{t.desc}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold">{t.precio}</span>
          <span className="text-cobre-dim group-hover:translate-x-1 transition-transform inline-block">
            Personalizar →
          </span>
        </div>
      </div>
    </Link>
  );
}
