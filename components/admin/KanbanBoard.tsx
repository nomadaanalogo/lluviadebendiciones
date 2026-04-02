'use client'

import { useState, useCallback } from 'react'
import { RefreshCw } from 'lucide-react'
import KanbanCard from './KanbanCard'
import type { Order, OrderStatus } from '@/lib/types'
import { getStatusLabel } from '@/lib/utils'

const COLUMNS: { status: OrderStatus; color: string; headerColor: string }[] = [
  { status: 'pendiente', color: 'border-yellow-200 bg-yellow-50/50', headerColor: 'bg-yellow-100 text-yellow-800' },
  { status: 'confirmado', color: 'border-blue-200 bg-blue-50/50', headerColor: 'bg-blue-100 text-blue-800' },
  { status: 'despachado', color: 'border-purple-200 bg-purple-50/50', headerColor: 'bg-purple-100 text-purple-800' },
  { status: 'entregado', color: 'border-green-200 bg-green-50/50', headerColor: 'bg-green-100 text-green-800' },
  { status: 'cancelado', color: 'border-red-200 bg-red-50/50', headerColor: 'bg-red-100 text-red-800' },
]

interface KanbanBoardProps {
  initialOrders: Order[]
}

export default function KanbanBoard({ initialOrders }: KanbanBoardProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [refreshing, setRefreshing] = useState(false)

  const handleStatusChange = useCallback(
    async (orderId: string, newStatus: OrderStatus) => {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )

      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        })

        if (!res.ok) {
          // Revert on error
          setOrders(initialOrders)
          throw new Error('Failed to update status')
        }
      } catch (err) {
        console.error(err)
        alert('Error al actualizar el estado. Recarga la página.')
      }
    },
    [initialOrders]
  )

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
      }
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div>
      {/* Refresh button */}
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 text-dark/50 hover:text-dark text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto">
        {COLUMNS.map(({ status, color, headerColor }) => {
          const columnOrders = orders.filter((o) => o.status === status)

          return (
            <div
              key={status}
              className={`kanban-column border ${color} min-w-[260px]`}
            >
              {/* Column header */}
              <div className={`flex items-center justify-between mb-3 px-2 py-1.5 rounded-lg ${headerColor}`}>
                <span className="font-semibold text-sm">
                  {getStatusLabel(status)}
                </span>
                <span className="text-xs font-bold bg-white/70 px-2 py-0.5 rounded-full">
                  {columnOrders.length}
                </span>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {columnOrders.length === 0 ? (
                  <div className="text-center py-8 text-dark/30 text-sm">
                    Sin pedidos
                  </div>
                ) : (
                  columnOrders.map((order) => (
                    <KanbanCard
                      key={order.id}
                      order={order}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
