'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  Home as HomeIcon,
  XCircle,
  Clock,
  ChevronRight,
  MapPin,
  Phone,
  ShoppingBag,
} from 'lucide-react'
import type { Order } from '@/lib/types'
import { formatCOP, formatDate, getStatusLabel } from '@/lib/utils'
import Link from 'next/link'

const STATUS_STEPS = [
  { key: 'pendiente', label: 'Pedido Recibido', icon: <Package size={20} />, desc: 'Hemos recibido tu pedido' },
  { key: 'confirmado', label: 'Confirmado', icon: <CheckCircle2 size={20} />, desc: 'Pedido verificado y listo' },
  { key: 'despachado', label: 'En Camino', icon: <Truck size={20} />, desc: 'Tu paquete está en tránsito' },
  { key: 'entregado', label: 'Entregado', icon: <HomeIcon size={20} />, desc: '¡Tu pedido llegó!' },
]

const STATUS_ORDER = ['pendiente', 'confirmado', 'despachado', 'entregado']

function getStatusIndex(status: string) {
  const idx = STATUS_ORDER.indexOf(status)
  return idx >= 0 ? idx : 0
}

function TrackingContent() {
  const searchParams = useSearchParams()
  const initialOrder = searchParams.get('order') || ''
  const isSuccess = searchParams.get('success') === 'true'

  const [orderNumber, setOrderNumber] = useState(initialOrder)
  const [searchInput, setSearchInput] = useState(initialOrder)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const searchOrder = async (num: string) => {
    if (!num.trim()) return

    setLoading(true)
    setNotFound(false)
    setOrder(null)

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(num.trim().toUpperCase())}`)

      if (res.status === 404) {
        setNotFound(true)
        return
      }

      if (!res.ok) throw new Error('Error en la búsqueda')

      const data = await res.json()
      setOrder(data.order)
      setOrderNumber(num.trim().toUpperCase())
    } catch {
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialOrder) {
      searchOrder(initialOrder)
    }
  }, [initialOrder]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentStepIdx = order ? getStatusIndex(order.status) : -1
  const isCancelled = order?.status === 'cancelado'

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success banner */}
      {isSuccess && order && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center">
          <div className="text-5xl mb-3">🙏</div>
          <h2 className="font-playfair text-2xl font-bold text-green-800 mb-2">
            ¡Gracias por tu pedido!
          </h2>
          <p className="text-green-700">
            Tu pedido <strong>{order.order_number}</strong> fue recibido con éxito.
            Te contactaremos por WhatsApp para confirmar la entrega.
          </p>
        </div>
      )}

      {/* Search form */}
      <div className="bg-white rounded-2xl p-6 border border-gold/15 mb-8">
        <h2 className="font-playfair text-xl font-bold text-dark mb-4">
          🔍 Rastrear mi Pedido
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            className="form-input flex-1"
            placeholder="Ej: LLB-2024-1234"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchOrder(searchInput)}
          />
          <button
            onClick={() => searchOrder(searchInput)}
            disabled={loading || !searchInput.trim()}
            className="btn-bordo px-6 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={18} />
            )}
            Buscar
          </button>
        </div>
        <p className="text-dark/40 text-xs mt-2">
          El número de pedido tiene el formato LLB-2024-XXXX y lo recibiste al confirmar tu compra
        </p>
      </div>

      {/* Not found */}
      {notFound && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <XCircle size={48} className="mx-auto mb-4 text-red-300" />
          <h3 className="font-playfair text-xl font-bold text-dark mb-2">
            Pedido no encontrado
          </h3>
          <p className="text-dark/60 mb-6 max-w-sm mx-auto">
            No encontramos ningún pedido con ese número. Verifica que el número sea correcto
            o contáctanos por WhatsApp.
          </p>
          <a
            href="https://wa.me/573001234567?text=Hola!%20Necesito%20ayuda%20para%20rastrear%20mi%20pedido"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>
      )}

      {/* Order found */}
      {order && (
        <div className="space-y-6">
          {/* Order header */}
          <div className="bg-white rounded-2xl p-6 border border-gold/15">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-dark/50 text-xs mb-0.5">Número de pedido</p>
                <p className="font-mono font-bold text-dark text-lg">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-dark/50 text-xs mb-0.5">Fecha</p>
                <p className="text-dark font-medium text-sm">{formatDate(order.created_at)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
              <div>
                <p className="text-dark/40 text-xs">Cliente</p>
                <p className="text-dark font-semibold text-sm">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-dark/40 text-xs">Total</p>
                <p className="text-bordo font-bold text-sm">{formatCOP(order.total)}</p>
              </div>
              <div>
                <p className="text-dark/40 text-xs">Pago</p>
                <p className="text-dark font-semibold text-sm capitalize">
                  {order.payment_method === 'contraentrega' ? '💵 Contraentrega' : '💳 Online'}
                </p>
              </div>
            </div>
          </div>

          {/* Status timeline */}
          {!isCancelled ? (
            <div className="bg-white rounded-2xl p-6 border border-gold/15">
              <h3 className="font-playfair font-bold text-dark text-lg mb-6">
                Estado de tu Pedido
              </h3>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-bordo transition-all duration-500"
                  style={{ height: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                />

                <div className="space-y-6">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIdx
                    const isCurrent = idx === currentStepIdx

                    return (
                      <div key={step.key} className="flex items-start gap-4">
                        <div
                          className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                          ${isCompleted
                            ? 'bg-bordo text-white shadow-bordo'
                            : 'bg-gray-100 text-gray-300'
                          }
                          ${isCurrent ? 'ring-4 ring-bordo/20' : ''}`}
                        >
                          {step.icon}
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-semibold text-sm ${isCompleted ? 'text-dark' : 'text-dark/30'}`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 text-xs bg-bordo text-white px-2 py-0.5 rounded-full">
                                ACTUAL
                              </span>
                            )}
                          </p>
                          <p className={`text-xs mt-0.5 ${isCompleted ? 'text-dark/60' : 'text-dark/30'}`}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200 text-center">
              <XCircle size={40} className="mx-auto mb-3 text-red-400" />
              <p className="font-playfair font-bold text-red-700 text-lg">Pedido Cancelado</p>
              <p className="text-red-600 text-sm mt-1">
                Este pedido ha sido cancelado. Contáctanos si necesitas ayuda.
              </p>
            </div>
          )}

          {/* Delivery info */}
          <div className="bg-white rounded-2xl p-6 border border-gold/15">
            <h3 className="font-playfair font-bold text-dark mb-4">Información de Entrega</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-bordo mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-dark font-medium text-sm">{order.customer_address}</p>
                  <p className="text-dark/60 text-xs">
                    {order.customer_city}, {order.customer_department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-bordo flex-shrink-0" />
                <p className="text-dark text-sm">{order.customer_phone}</p>
              </div>
              {order.notes && (
                <div className="flex items-start gap-3">
                  <Clock size={16} className="text-bordo mt-0.5 flex-shrink-0" />
                  <p className="text-dark/70 text-sm italic">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order items */}
          {order.order_items && order.order_items.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gold/15">
              <h3 className="font-playfair font-bold text-dark mb-4">Productos Pedidos</h3>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-bordo-dark to-bordo flex items-center justify-center flex-shrink-0">
                        <span className="text-gold text-sm">✝</span>
                      </div>
                      <div>
                        <p className="text-dark font-medium text-sm">{item.product_name}</p>
                        <p className="text-dark/50 text-xs">Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-dark">{formatCOP(item.total_price)}</p>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/60">Subtotal</span>
                    <span>{formatCOP(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/60">Envío</span>
                    <span className={order.shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                      {order.shipping === 0 ? 'GRATIS' : formatCOP(order.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-gray-100 pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-bordo text-lg">{formatCOP(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Need help */}
          <div className="text-center py-6 bg-green-50 rounded-2xl border border-green-100">
            <p className="text-dark/70 text-sm mb-3">¿Tienes preguntas sobre tu pedido?</p>
            <a
              href={`https://wa.me/573001234567?text=Hola!%20Quiero%20consultar%20sobre%20mi%20pedido%20${order.order_number}`}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Hablar con soporte
            </a>
          </div>
        </div>
      )}

      {/* No search yet */}
      {!loading && !order && !notFound && !initialOrder && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <Package size={48} className="mx-auto mb-4 text-gray-200" />
          <h3 className="font-playfair text-xl font-bold text-dark mb-2">
            Rastrea tu Pedido
          </h3>
          <p className="text-dark/60 max-w-sm mx-auto mb-6">
            Ingresa tu número de pedido (formato LLB-2024-XXXX) para ver el estado
            de tu envío en tiempo real.
          </p>
          <Link href="/checkout" className="btn-bordo inline-flex items-center gap-2">
            <ShoppingBag size={18} />
            Hacer un pedido
          </Link>
        </div>
      )}
    </div>
  )
}

export default function SeguimientoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-16">
        {/* Header */}
        <div className="bg-bordo-dark border-b border-gold/20 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-playfair text-3xl font-bold text-gold mb-2">
              📦 Seguimiento de Pedido
            </h1>
            <p className="text-cream/60">
              Consulta el estado de tu pedido en tiempo real
            </p>
          </div>
        </div>

        <Suspense fallback={
          <div className="max-w-3xl mx-auto px-4 py-12 text-center">
            <div className="w-10 h-10 border-3 border-bordo/30 border-t-bordo rounded-full animate-spin mx-auto" />
          </div>
        }>
          <TrackingContent />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
