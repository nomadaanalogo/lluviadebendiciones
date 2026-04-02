import { createClient } from '@/lib/supabase/server'
import KanbanBoard from '@/components/admin/KanbanBoard'
import type { Order } from '@/lib/types'

async function getOrders(): Promise<Order[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export default async function PedidosPage() {
  const orders = await getOrders()

  const counts = {
    total: orders.length,
    pendiente: orders.filter((o) => o.status === 'pendiente').length,
    confirmado: orders.filter((o) => o.status === 'confirmado').length,
    despachado: orders.filter((o) => o.status === 'despachado').length,
    entregado: orders.filter((o) => o.status === 'entregado').length,
    cancelado: orders.filter((o) => o.status === 'cancelado').length,
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-dark">
          Gestión de Pedidos
        </h1>
        <p className="text-dark/50 text-sm mt-1">
          {counts.total} pedidos en total · {counts.pendiente} pendientes · {counts.despachado} en camino
        </p>
      </div>

      {/* Summary pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: 'Total', count: counts.total, color: 'bg-gray-100 text-gray-700' },
          { label: 'Pendiente', count: counts.pendiente, color: 'bg-yellow-100 text-yellow-800' },
          { label: 'Confirmado', count: counts.confirmado, color: 'bg-blue-100 text-blue-800' },
          { label: 'Despachado', count: counts.despachado, color: 'bg-purple-100 text-purple-800' },
          { label: 'Entregado', count: counts.entregado, color: 'bg-green-100 text-green-800' },
          { label: 'Cancelado', count: counts.cancelado, color: 'bg-red-100 text-red-800' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${color}`}>
            {label}: {count}
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <KanbanBoard initialOrders={orders} />
    </div>
  )
}
