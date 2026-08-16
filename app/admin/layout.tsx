import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/clientes", label: "Clientes" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hueso">
      {/* Advertencia visible mientras no haya login (Fase 20) */}
      <div className="bg-cobre text-grafito text-xs font-semibold text-center py-2 px-4">
        ⚠ Panel sin login todavía — no compartas esta URL. Se protegerá en la Fase 20 (Seguridad).
      </div>

      <div className="flex">
        <aside className="w-56 shrink-0 bg-grafito text-hueso min-h-screen p-6">
          <Link href="/" className="font-display text-xl block mb-10">
            Termazo <span className="text-plata text-xs block font-body">Admin</span>
          </Link>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-plata hover:text-hueso hover:bg-white/5 px-3 py-2 rounded-sm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}
