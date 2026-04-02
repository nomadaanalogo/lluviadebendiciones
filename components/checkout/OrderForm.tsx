'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Shield, Truck, CreditCard, Banknote, Check, ChevronRight, AlertCircle } from 'lucide-react'
import ColombiaSelect from './ColombiaSelect'
import { formatCOP } from '@/lib/utils'
import type { PaymentMethod } from '@/lib/types'

const SHIPPING_COST = 8000

interface BundleOption {
  qty: number
  price: number
  label: string
  badge: string
}

interface FormState {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_department: string
  customer_city: string
  customer_address: string
  payment_method: PaymentMethod
  notes: string
}

export default function OrderForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialQty = parseInt(searchParams.get('qty') || '1')

  const [bundles, setBundles] = useState<BundleOption[]>([])
  const [productId, setProductId] = useState('a1b2c3d4-e5f6-7890-abcd-ef1234567890')
  const [loadingBundles, setLoadingBundles] = useState(true)
  const [selectedBundle, setSelectedBundle] = useState<BundleOption | null>(null)

  useEffect(() => {
    fetch('/api/products/lluvia-de-bendiciones')
      .then((r) => r.json())
      .then((data) => {
        const product = data.product
        if (!product) return
        setProductId(product.id)
        const sorted: BundleOption[] = (product.bundles || [])
          .filter((b: { active: boolean }) => b.active)
          .sort((a: { quantity: number }, b: { quantity: number }) => a.quantity - b.quantity)
          .map((b: { quantity: number; price: number; label: string; badge: string }) => ({
            qty: b.quantity,
            price: b.price,
            label: `${b.quantity} ${b.quantity === 1 ? 'Colgante' : 'Colgantes'}${b.badge ? ` (${b.badge})` : ''}`,
            badge: b.badge || '',
          }))
        setBundles(sorted)
        const preferred = sorted.find((b) => b.qty === initialQty) || sorted[0]
        setSelectedBundle(preferred ?? null)
      })
      .catch(() => {
        // fallback a valores por defecto si falla la API
        const fallback: BundleOption[] = [
          { qty: 1, price: 35000, label: '1 Colgante', badge: '' },
          { qty: 2, price: 59900, label: '2 Colgantes (🔥 MÁS POPULAR)', badge: '🔥 MÁS POPULAR' },
          { qty: 4, price: 79900, label: '4 Colgantes (⭐ MÁS VENDIDO)', badge: '⭐ MÁS VENDIDO' },
          { qty: 6, price: 99900, label: '6 Colgantes (💎 MEJOR OFERTA)', badge: '💎 MEJOR OFERTA' },
        ]
        setBundles(fallback)
        setSelectedBundle(fallback.find((b) => b.qty === initialQty) || fallback[0])
      })
      .finally(() => setLoadingBundles(false))
  }, [initialQty])

  const [form, setForm] = useState<FormState>({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_department: '',
    customer_city: '',
    customer_address: '',
    payment_method: 'contraentrega',
    notes: '',
  })
  const [customCity, setCustomCity] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const freeShipping = (selectedBundle?.qty ?? 1) >= 2
  const shipping = freeShipping ? 0 : SHIPPING_COST
  const total = (selectedBundle?.price ?? 0) + shipping

  const finalCity = form.customer_city === '__otro__' ? customCity : form.customer_city

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {}

    if (!form.customer_name.trim()) newErrors.customer_name = 'El nombre es requerido'
    if (!form.customer_phone.trim()) newErrors.customer_phone = 'El teléfono es requerido'
    else if (!/^(57)?3\d{9}$/.test(form.customer_phone.replace(/\D/g, ''))) {
      newErrors.customer_phone = 'Ingresa un número válido (ej: 3001234567)'
    }
    if (!form.customer_department) newErrors.customer_department = 'Selecciona el departamento'
    if (!form.customer_city) newErrors.customer_city = 'Selecciona la ciudad'
    if (form.customer_city === '__otro__' && !customCity.trim()) {
      newErrors.customer_city = 'Ingresa el nombre de tu ciudad'
    }
    if (!form.customer_address.trim()) newErrors.customer_address = 'La dirección es requerida'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!validate()) {
      // Scroll al primer error visible
      setTimeout(() => {
        const firstError = document.querySelector('[data-error]')
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }

    if (!selectedBundle) return
    setSubmitting(true)

    try {
      const payload = {
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.replace(/\D/g, ''),
        customer_email: form.customer_email.trim() || undefined,
        customer_city: finalCity,
        customer_department: form.customer_department,
        customer_address: form.customer_address.trim(),
        payment_method: form.payment_method,
        notes: form.notes.trim() || undefined,
        items: [
          {
            product_id: productId,
            product_name: 'Lluvia de Bendiciones',
            quantity: selectedBundle?.qty ?? 1,
            unit_price: Math.round((selectedBundle?.price ?? 0) / (selectedBundle?.qty ?? 1)),
            total_price: selectedBundle?.price ?? 0,
          },
        ],
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Error al crear el pedido')
      }

      const data = await res.json()
      router.push(`/seguimiento?order=${data.order_number}&success=true`)
    } catch (err) {
      console.error(err)
      setSubmitError(
        err instanceof Error
          ? err.message
          : 'Hubo un error al procesar tu pedido. Por favor intenta de nuevo.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setSubmitting(false)
    }
  }

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form fields */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bundle selector */}
          <div className="bg-white rounded-2xl p-6 border border-gold/15">
            <h2 className="font-playfair text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-bordo text-cream text-sm font-bold flex items-center justify-center">
                1
              </span>
              Elige tu paquete
            </h2>
            {loadingBundles ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {bundles.map((bundle) => (
                  <label
                    key={bundle.qty}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${selectedBundle?.qty === bundle.qty
                      ? 'border-bordo bg-bordo/5'
                      : 'border-gray-100 hover:border-gold/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="bundle"
                        value={bundle.qty}
                        checked={selectedBundle?.qty === bundle.qty}
                        onChange={() => setSelectedBundle(bundle)}
                        className="accent-bordo"
                      />
                      <div>
                        <p className="font-semibold text-dark text-sm">{bundle.label}</p>
                        <p className="text-dark/50 text-xs">
                          {formatCOP(Math.round(bundle.price / bundle.qty))} por unidad
                          {bundle.qty >= 2 && (
                            <span className="text-green-600 font-semibold ml-1">· Envío GRATIS</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold ${selectedBundle?.qty === bundle.qty ? 'text-bordo' : 'text-dark'}`}>
                      {formatCOP(bundle.price)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Personal info */}
          <div className="bg-white rounded-2xl p-6 border border-gold/15">
            <h2 className="font-playfair text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-bordo text-cream text-sm font-bold flex items-center justify-center">
                2
              </span>
              Datos personales
            </h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Nombre completo *</label>
                <input
                  type="text"
                  className={`form-input ${errors.customer_name ? 'border-red-400 focus:ring-red-400' : ''}`}
                  placeholder="Ej: María Fernández López"
                  value={form.customer_name}
                  onChange={(e) => update('customer_name', e.target.value)}
                  required
                />
                {errors.customer_name && (
                  <p data-error className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />{errors.customer_name}
                  </p>
                )}
              </div>
              <div>
                <label className="form-label">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  className={`form-input ${errors.customer_phone ? 'border-red-400' : ''}`}
                  placeholder="3001234567"
                  value={form.customer_phone}
                  onChange={(e) => update('customer_phone', e.target.value)}
                  required
                />
                {errors.customer_phone && (
                  <p data-error className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />{errors.customer_phone}
                  </p>
                )}
                <p className="text-dark/40 text-xs mt-1">
                  Te notificaremos el estado de tu pedido por aquí
                </p>
              </div>
              <div>
                <label className="form-label">Correo electrónico (opcional)</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="tu@correo.com"
                  value={form.customer_email}
                  onChange={(e) => update('customer_email', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-2xl p-6 border border-gold/15">
            <h2 className="font-playfair text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-bordo text-cream text-sm font-bold flex items-center justify-center">
                3
              </span>
              Dirección de entrega
            </h2>
            <div className="space-y-4">
              <ColombiaSelect
                selectedDept={form.customer_department}
                selectedCity={form.customer_city}
                onDeptChange={(v) => update('customer_department', v)}
                onCityChange={(v) => update('customer_city', v)}
              />
              {(errors.customer_department || errors.customer_city) && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.customer_department || errors.customer_city}
                </p>
              )}

              {/* Custom city input */}
              {form.customer_city === '__otro__' && (
                <div>
                  <label className="form-label">Nombre de tu ciudad/municipio *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Escribe el nombre de tu ciudad"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label className="form-label">Dirección completa *</label>
                <input
                  type="text"
                  className={`form-input ${errors.customer_address ? 'border-red-400' : ''}`}
                  placeholder="Ej: Calle 45 # 10-32, Barrio El Centro"
                  value={form.customer_address}
                  onChange={(e) => update('customer_address', e.target.value)}
                  required
                />
                {errors.customer_address && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} />{errors.customer_address}
                  </p>
                )}
              </div>

              <div>
                <label className="form-label">Notas adicionales (opcional)</label>
                <textarea
                  rows={2}
                  className="form-input resize-none"
                  placeholder="Ej: Llamar antes de entregar, dejar con el portero, etc."
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl p-6 border border-gold/15">
            <h2 className="font-playfair text-xl font-bold text-dark mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-bordo text-cream text-sm font-bold flex items-center justify-center">
                4
              </span>
              Método de pago
            </h2>
            <div className="space-y-3">
              {/* Contraentrega */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${form.payment_method === 'contraentrega'
                  ? 'border-bordo bg-bordo/5'
                  : 'border-gray-100 hover:border-gold/30'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="contraentrega"
                  checked={form.payment_method === 'contraentrega'}
                  onChange={() => update('payment_method', 'contraentrega')}
                  className="accent-bordo mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Banknote size={18} className="text-bordo" />
                    <span className="font-bold text-dark">Contraentrega</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                      RECOMENDADO
                    </span>
                  </div>
                  <p className="text-dark/60 text-sm">
                    Paga cuando recibas tu pedido en la puerta de tu casa.
                    Sin riesgos, sin adelantos.
                  </p>
                </div>
              </label>

              {/* Pago inmediato */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${form.payment_method === 'pago_inmediato'
                  ? 'border-bordo bg-bordo/5'
                  : 'border-gray-100 hover:border-gold/30'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="pago_inmediato"
                  checked={form.payment_method === 'pago_inmediato'}
                  onChange={() => update('payment_method', 'pago_inmediato')}
                  className="accent-bordo mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard size={18} className="text-bordo" />
                    <span className="font-bold text-dark">Pagar ahora</span>
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                      WOMPI
                    </span>
                  </div>
                  <p className="text-dark/60 text-sm">
                    Pago en línea seguro con tarjeta o PSE. Envío prioritario.
                  </p>
                  {form.payment_method === 'pago_inmediato' && (
                    <p className="text-amber-600 text-xs mt-2 bg-amber-50 rounded px-2 py-1">
                      ⚙️ Integración de pago en línea próximamente disponible.
                      Tu pedido se procesará como contraentrega por ahora.
                    </p>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl border border-gold/20 overflow-hidden shadow-gold">
              <div className="bg-bordo-dark px-6 py-4">
                <h3 className="font-playfair text-gold font-bold text-lg">
                  Resumen del Pedido
                </h3>
              </div>

              <div className="p-6">
                {/* Product */}
                <div className="flex gap-4 mb-6">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-bordo-dark to-bordo flex items-center justify-center flex-shrink-0">
                    <span className="text-gold text-2xl">✝</span>
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">Lluvia de Bendiciones</p>
                    <p className="text-dark/50 text-xs mt-0.5">
                      {selectedBundle?.qty ?? 1} {(selectedBundle?.qty ?? 1) === 1 ? 'colgante' : 'colgantes'}
                    </p>
                    <p className="text-bordo font-bold mt-1">{formatCOP(selectedBundle?.price ?? 0)}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/60">Subtotal</span>
                    <span className="font-medium">{formatCOP(selectedBundle?.price ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark/60 flex items-center gap-1">
                      <Truck size={14} />
                      Envío
                    </span>
                    <span className={`font-medium ${freeShipping ? 'text-green-600' : ''}`}>
                      {freeShipping ? '¡GRATIS!' : formatCOP(SHIPPING_COST)}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-dark">Total</span>
                      <span className="font-bold text-xl text-bordo">{formatCOP(total)}</span>
                    </div>
                    <p className="text-dark/40 text-xs mt-1 text-right">COP (pesos colombianos)</p>
                  </div>
                </div>

                {/* Trust elements */}
                <div className="mt-5 space-y-2">
                  {[
                    { icon: <Shield size={14} />, text: 'Pago 100% seguro' },
                    { icon: <Truck size={14} />, text: 'Seguimiento en tiempo real' },
                    { icon: <Check size={14} />, text: 'Garantía de satisfacción' },
                  ].map(({ icon, text }, i) => (
                    <div key={i} className="flex items-center gap-2 text-dark/60 text-xs">
                      <span className="text-green-500">{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>

                {/* Validation summary */}
                {Object.keys(errors).length > 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-600 text-xs">
                      Por favor completa todos los campos obligatorios antes de continuar.
                    </p>
                  </div>
                )}

                {/* API error */}
                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-600 text-xs font-semibold">Error al procesar el pedido</p>
                      <p className="text-red-500 text-xs mt-0.5">{submitError}</p>
                      <p className="text-red-400 text-xs mt-1">
                        ¿Problemas? Escríbenos por{' '}
                        <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573001234567'}`}
                          target="_blank" rel="noopener noreferrer"
                          className="underline font-medium">WhatsApp</a>
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold w-full mt-6 flex items-center justify-center gap-2 text-base font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      {form.payment_method === 'contraentrega'
                        ? '🛒 Confirmar Pedido'
                        : '💳 Pagar Ahora'}
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-dark/40 text-xs mt-3">
                  Al confirmar aceptas nuestros términos y política de privacidad
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
