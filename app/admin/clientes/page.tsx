import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminClientes() {
  const clientes = await prisma.customer.findMany({
    include: { orders: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Clientes</h1>

      {clientes.length === 0 ? (
        <p className="text-grafito/50">Todavía no hay clientes registrados.</p>
      ) : (
        <div className="bg-white border border-grafito/10">
          <div className="grid grid-cols-[1fr_1fr_1fr_120px_140px] gap-4 px-5 py-3 text-xs uppercase tracking-widest text-grafito/40 border-b border-grafito/10">
            <span>Nombre</span>
            <span>Email</span>
            <span>Teléfono</span>
            <span>Pedidos</span>
            <span>Total gastado</span>
          </div>
          {clientes.map((c) => {
            const totalGastado = c.orders
              .filter((o) => o.estado !== "PENDIENTE_PAGO" && o.estado !== "CANCELADO")
              .reduce((acc, o) => acc + o.total, 0);
            return (
              <div
                key={c.id}
                className="grid grid-cols-[1fr_1fr_1fr_120px_140px] gap-4 px-5 py-4 items-center text-sm border-b border-grafito/5 last:border-0"
              >
                <span className="font-semibold">{c.nombre}</span>
                <span className="text-grafito/70">{c.email}</span>
                <span className="text-grafito/70">{c.telefono}</span>
                <span>{c.orders.length}</span>
                <span className="font-semibold">${totalGastado} MXN</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
