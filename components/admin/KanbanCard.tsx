'use client'

import { useState } from 'react'
import { ChevronRight, Phone, MapPin, Calendar, DollarSign, X, Check } from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/types'
import { formatCOP, formatDateShort, getStatusLabel, getStatusColor } from '@/lib/utils'

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  pendiente: 'confirmado',
  confirmado: 'despachado',
  despachado: 'entregado',
  entregado: null,
  cancelado: null,
}

const NEXT_STATUS_LABELS: Record<string, string> = {
  confirmado: '✅ Confirmar pedido',
  despachado: '📦 Marcar despachado',
  entregado: '🎉 Marcar entregado',
}

interface KanbanCardProps {
  order: Order
  onStatusChange: (orderId: string, newStatus: OrderStatus) => Promise<void>
}

export default function KanbanCard({ order, onStatusChange }: KanbanCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [moving, setMoving] = useState(false)

  const nextStatus = STATUS_FLOW[order.status]

  const handleMove = async (newStatus: OrderStatus) => {
    setMoving(true)
    try {
      await onStatusChange(order.id, newStatus)
    } finally {
      setMoving(false)
      setExpanded(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Card header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <p className="font-mono text-xs text-dark/40 mb-0.5">{order.order_number}</p>
            <p className="font-semibold text-dark text-sm leading-tight">{order.customer_name}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-bold text-bordo text-sm">{formatCOP(order.total)}</p>
            <p className="text-dark/40 text-xs">{formatDateShort(order.created_at)}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-dark/60 text-xs">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{order.customer_city}, {order.customer_department}</span>
          </div>
          <div className="flex items-center gap-1.5 text-dark/60 text-xs">
            <Phone size={11} className="flex-shrink-0" />
            <span>{order.customer_phone}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
            <span className="text-dark/40 text-xs">
              {order.payment_method === 'contraentrega' ? '💵 Contraentrega' : '💳 Online'}
            </span>
          </div>
        </div>
      </div>

      {/* Expanded actions */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-3 space-y-2">
          {/* Order items summary */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="text-xs text-dark/60 mb-2">
              {order.order_items.map((item, i) => (
                <p key={i}>
                  {item.quantity}× {item.product_name} — {formatCOP(item.total_price)}
                </p>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-1.5">
            {nextStatus && (
              <button
                onClick={() => handleMove(nextStatus)}
                disabled={moving}
                className="w-full flex items-center justify-center gap-2 bg-bordo text-cream text-xs font-semibold py-2 px-3 rounded-lg hover:bg-bordo-light transition-colors disabled:opacity-50"
              >
                {moving ? (
                  <div className="w-3 h-3 border border-cream/50 border-t-cream rounded-full animate-spin" />
                ) : (
                  <>
                    <ChevronRight size={14} />
                    {NEXT_STATUS_LABELS[nextStatus] || `Mover a ${getStatusLabel(nextStatus)}`}
                  </>
                )}
              </button>
            )}

            {order.status !== 'cancelado' && order.status !== 'entregado' && (
              <button
                onClick={() => handleMove('cancelado')}
                disabled={moving}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 text-xs font-medium py-2 px-3 rounded-lg hover:bg-red-100 transition-colors border border-red-100 disabled:opacity-50"
              >
                <X size={14} />
                Cancelar pedido
              </button>
            )}

            <a
              href={`https://wa.me/57${order.customer_phone}?text=Hola%20${encodeURIComponent(order.customer_name)}!%20Te%20contactamos%20de%20Lluvia%20de%20Bendiciones%20sobre%20tu%20pedido%20${order.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 text-xs font-medium py-2 px-3 rounded-lg hover:bg-green-100 transition-colors border border-green-100"
            >
              💬 Contactar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
