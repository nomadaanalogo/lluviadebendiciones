import { createClient } from '@/lib/supabase/server'
import StatsCard from '@/components/admin/StatsCard'
import { ShoppingCart, TrendingUp, Package, Users, DollarSign, Clock } from 'lucide-react'
import { formatCOP } from '@/lib/utils'
import type { Order, OrderStatus } from '@/lib/types'

async function getDashboardData() {
  try {
    const supabase = createClient()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [allOrdersRes, todayOrdersRes, reviewsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').gte('created_at', today.toISOString()),
      supabase.from('reviews').select('id', { count: 'exact' }).eq('approved', false),
    ])

    const allOrders: Order[] = allOrdersRes.data || []
    const todayOrders: Order[] = todayOrdersRes.data || []

    const totalRevenue = allOrders
      .filter((o) => o.status !== 'cancelado')
      .reduce((sum, o) => sum + o.total, 0)

    const todayRevenue = todayOrders
      .filter((o) => o.status !== 'cancelado')
      .reduce((sum, o) => sum + o.total, 0)

    const ordersByStatus = allOrders.reduce((acc, order) => {
      acc[order.status as OrderStatus] = (acc[order.status as OrderStatus] || 0) + 1
      return acc
    }, {} as Record<OrderStatus, number>)

    const pendingReviews = reviewsRes.count || 0

    // Revenue by day for chart (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d.toISOString().split('T')[0]
    })

    const revenueByDay = last7Days.map((day) => {
      const dayOrders = allOrders.filter(
        (o) => o.created_at.split('T')[0] === day && o.status !== 'cancelado'
      )
      return {
        day: day.slice(5), // MM-DD
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        count: dayOrders.length,
      }
    })

    const maxRevenue = Math.max(...revenueByDay.map((d) => d.revenue), 1)

    return {
      totalOrders: allOrders.length,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue,
      ordersByStatus,
      recentOrders: allOrders.slice(0, 10),
      revenueByDay,
      maxRevenue,
      pendingReviews,
    }
  } catch {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      todayOrders: 0,
      todayRevenue: 0,
      ordersByStatus: {} as Record<OrderStatus, number>,
      recentOrders: [],
      revenueByDay: [],
      maxRevenue: 1,
      pendingReviews: 0,
    }
  }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-400' },
  confirmado: { label: 'Confirmado', color: 'bg-blue-400' },
  despachado: { label: 'Despachado', color: 'bg-purple-400' },
  entregado: { label: 'Entregado', color: 'bg-green-400' },
  cancelado: { label: 'Cancelado', color: 'bg-red-400' },
}

export default async function DashboardPage() {
  const data = await getDashboardData()

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-dark">
          Dashboard
        </h1>
        <p className="text-dark/50 text-sm mt-1">
          Resumen de ventas y pedidos — {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Pedidos"
          value={data.totalOrders}
          subtitle="Todos los tiempos"
          icon={<ShoppingCart size={20} className="text-bordo" />}
          variant="bordo"
        />
        <StatsCard
          title="Ingresos Totales"
          value={formatCOP(data.totalRevenue)}
          subtitle="Pedidos no cancelados"
          icon={<TrendingUp size={20} className="text-gold" />}
          variant="gold"
        />
        <StatsCard
          title="Pedidos Hoy"
          value={data.todayOrders}
          subtitle="Nuevos pedidos"
          icon={<Clock size={20} className="text-blue-500" />}
        />
        <StatsCard
          title="Ingresos Hoy"
          value={formatCOP(data.todayRevenue)}
          subtitle="Ventas del día"
          icon={<DollarSign size={20} className="text-green-500" />}
          variant="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-playfair font-bold text-dark text-lg mb-6">
            Ingresos Últimos 7 Días
          </h2>

          {data.revenueByDay.length > 0 ? (
            <div className="space-y-3">
              {/* Bar chart */}
              <div className="flex items-end gap-2 h-40">
                {data.revenueByDay.map(({ day, revenue, count }, i) => {
                  const pct = (revenue / data.maxRevenue) * 100
                  const date = new Date()
                  date.setDate(date.getDate() - (6 - i))
                  const dayName = dayNames[date.getDay()]

                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center relative group">
                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 bg-dark text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {formatCOP(revenue)} ({count} pedidos)
                        </div>
                        <div
                          className="w-full rounded-t-md transition-all duration-300 cursor-pointer"
                          style={{
                            height: `${Math.max(pct, 4)}%`,
                            background: 'linear-gradient(to top, #8B1E2E, #A8293C)',
                          }}
                        />
                      </div>
                      <span className="text-xs text-dark/50">{dayName}</span>
                    </div>
                  )
                })}
              </div>

              {/* Y-axis labels */}
              <div className="flex justify-between text-xs text-dark/40 mt-2">
                <span>{formatCOP(0)}</span>
                <span>{formatCOP(Math.round(data.maxRevenue / 2))}</span>
                <span>{formatCOP(data.maxRevenue)}</span>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-dark/30">
              No hay datos de ventas aún
            </div>
          )}
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-playfair font-bold text-dark text-lg mb-6">
            Pedidos por Estado
          </h2>
          <div className="space-y-4">
            {Object.entries(STATUS_LABELS).map(([status, { label, color }]) => {
              const count = data.ordersByStatus[status as OrderStatus] || 0
              const pct = data.totalOrders > 0 ? (count / data.totalOrders) * 100 : 0

              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark/70 font-medium">{label}</span>
                    <span className="font-bold text-dark">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {data.pendingReviews > 0 && (
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-700 text-xs font-semibold">
                ⭐ {data.pendingReviews} reseña{data.pendingReviews > 1 ? 's' : ''} pendiente{data.pendingReviews > 1 ? 's' : ''} de aprobación
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recent orders table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-playfair font-bold text-dark text-lg">
            Pedidos Recientes
          </h2>
          <a href="/admin/pedidos" className="text-bordo hover:text-bordo-light text-sm font-medium transition-colors">
            Ver todos →
          </a>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="p-12 text-center text-dark/30">
            <ShoppingCart size={40} className="mx-auto mb-3" />
            <p>No hay pedidos aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Pedido', 'Cliente', 'Ciudad', 'Total', 'Estado', 'Fecha'].map((col) => (
                    <th key={col} className="text-left text-xs font-semibold text-dark/50 px-4 py-3 uppercase tracking-wide">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-bordo font-bold">{order.order_number}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-dark">{order.customer_name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-dark/60">{order.customer_city}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-sm text-dark">{formatCOP(order.total)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium
                        ${STATUS_LABELS[order.status]?.color.replace('bg-', 'bg-').replace('400', '100')}
                        text-${order.status === 'entregado' ? 'green' : order.status === 'cancelado' ? 'red' : order.status === 'despachado' ? 'purple' : order.status === 'confirmado' ? 'blue' : 'yellow'}-800`}
                      >
                        {STATUS_LABELS[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-dark/50">
                        {new Date(order.created_at).toLocaleDateString('es-CO')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
