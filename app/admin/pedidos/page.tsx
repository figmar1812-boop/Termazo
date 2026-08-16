import { prisma } from "@/lib/db";
import PedidosTabla from "./PedidosTabla";

export const dynamic = "force-dynamic";

export default async function AdminPedidos() {
  const pedidos = await prisma.order.findMany({
    include: { customer: true, items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Pedidos</h1>
      <PedidosTabla pedidos={JSON.parse(JSON.stringify(pedidos))} />
    </div>
  );
}
