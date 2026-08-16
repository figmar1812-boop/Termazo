import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalPedidos, pedidosPendientes, ventasResult, totalClientes, totalProductos] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { estado: "PENDIENTE_PAGO" } }),
      prisma.order.aggregate({
        where: { estado: { notIn: ["PENDIENTE_PAGO", "CANCELADO"] } },
        _sum: { total: true },
      }),
      prisma.customer.count(),
      prisma.product.count(),
    ]);

  const stats = [
    { label: "Pedidos totales", value: totalPedidos },
    { label: "Pendientes de pago", value: pedidosPendientes },
    { label: "Ventas confirmadas", value: `$${ventasResult._sum.total ?? 0} MXN` },
    { label: "Clientes", value: totalClientes },
    { label: "Productos activos", value: totalProductos },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Resumen</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-grafito/10 p-5">
            <p className="text-xs text-grafito/50 uppercase tracking-widest mb-2">{s.label}</p>
            <p className="font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
