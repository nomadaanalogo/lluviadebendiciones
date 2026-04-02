'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Save } from 'lucide-react'
import type { Product, Bundle } from '@/lib/types'
import { formatCOP } from '@/lib/utils'

interface BundleRow {
  id?: string
  quantity: number
  discount_pct: number
  price: number
  label: string
  badge: string
}

interface ProductFormModalProps {
  product?: Product | null
  bundles?: Bundle[]
  onClose: () => void
  onSave: (data: Partial<Product> & { bundles: BundleRow[] }) => Promise<void>
}

function calcBundlePrice(basePrice: number, quantity: number, discountPct: number) {
  return Math.round(basePrice * quantity * (1 - discountPct / 100))
}

function deriveDiscountPct(basePrice: number, quantity: number, totalPrice: number) {
  if (!basePrice || !quantity) return 0
  const pct = (1 - totalPrice / (basePrice * quantity)) * 100
  return Math.round(Math.max(0, pct))
}

const DEFAULT_BUNDLES: Omit<BundleRow, 'price'>[] = [
  { quantity: 1, discount_pct: 0,  label: '',           badge: '' },
  { quantity: 2, discount_pct: 14, label: 'Más popular', badge: '🔥 MÁS POPULAR' },
  { quantity: 4, discount_pct: 43, label: 'Más vendido', badge: '⭐ MÁS VENDIDO' },
  { quantity: 6, discount_pct: 52, label: 'Mejor oferta', badge: '💎 MEJOR OFERTA' },
]

export default function ProductFormModal({ product, bundles, onClose, onSave }: ProductFormModalProps) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    short_description: product?.short_description || '',
    description: product?.description || '',
    price: product?.price ? String(product.price) : '',
    stock: product?.stock ? String(product.stock) : '0',
    active: product?.active ?? true,
    images: product?.images?.length ? product.images : [''],
  })

  const basePrice = parseInt(form.price) || 0

  const initBundles = (): BundleRow[] => {
    if (bundles && bundles.length > 0) {
      return bundles.map((b) => ({
        id: b.id,
        quantity: b.quantity,
        discount_pct: deriveDiscountPct(basePrice, b.quantity, b.price),
        price: b.price,
        label: b.label || '',
        badge: b.badge || '',
      }))
    }
    return DEFAULT_BUNDLES.map((b) => ({
      ...b,
      price: calcBundlePrice(basePrice || 35000, b.quantity, b.discount_pct),
    }))
  }

  const [bundleRows, setBundleRows] = useState<BundleRow[]>(initBundles)
  const [saving, setSaving] = useState(false)

  // Recalculate all bundle prices when base price changes
  useEffect(() => {
    if (!basePrice) return
    setBundleRows((prev) =>
      prev.map((b) => ({
        ...b,
        price: calcBundlePrice(basePrice, b.quantity, b.discount_pct),
      }))
    )
  }, [basePrice])

  const updateBundle = (index: number, field: keyof BundleRow, value: string | number) => {
    setBundleRows((prev) => {
      const updated = [...prev]
      const row = { ...updated[index], [field]: value }

      if (field === 'discount_pct' || field === 'quantity') {
        row.price = calcBundlePrice(basePrice, Number(row.quantity), Number(row.discount_pct))
      }
      updated[index] = row
      return updated
    })
  }

  const addBundle = () => {
    setBundleRows((prev) => [
      ...prev,
      { quantity: 1, discount_pct: 0, price: basePrice, label: '', badge: '' },
    ])
  }

  const removeBundle = (index: number) => {
    setBundleRows((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({
        ...form,
        price: parseInt(form.price) || 0,
        stock: parseInt(form.stock) || 0,
        images: form.images.filter((img) => img.trim() !== ''),
        bundles: bundleRows,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  const updateImage = (index: number, value: string) => {
    const newImages = [...form.images]
    newImages[index] = value
    setForm({ ...form, images: newImages })
  }

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-playfair font-bold text-dark text-xl">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onClose} className="text-dark/40 hover:text-dark transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nombre del producto *</label>
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: product ? form.slug : generateSlug(e.target.value),
                  })
                }
                placeholder="Ej: Lluvia de Bendiciones"
              />
            </div>
            <div>
              <label className="form-label">Slug (URL)</label>
              <input
                type="text"
                className="form-input"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="lluvia-de-bendiciones"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Descripción corta</label>
            <input
              type="text"
              className="form-input"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              placeholder="Descripción breve para listados"
              maxLength={200}
            />
          </div>

          <div>
            <label className="form-label">Descripción completa</label>
            <textarea
              rows={4}
              className="form-input resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descripción detallada del producto..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Precio base (COP) *</label>
              <input
                type="number"
                className="form-input"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="35000"
                min="0"
              />
            </div>
            <div>
              <label className="form-label">Stock disponible</label>
              <input
                type="number"
                className="form-input"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Bundles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="form-label mb-0">Packs con descuento</label>
              <button
                type="button"
                onClick={addBundle}
                className="flex items-center gap-1.5 text-bordo hover:text-bordo-light text-xs font-medium transition-colors"
              >
                <Plus size={14} />
                Agregar pack
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-3 py-2.5 text-xs text-dark/50 font-medium">Uds.</th>
                    <th className="text-left px-3 py-2.5 text-xs text-dark/50 font-medium">Descuento %</th>
                    <th className="text-left px-3 py-2.5 text-xs text-dark/50 font-medium">Precio total</th>
                    <th className="text-left px-3 py-2.5 text-xs text-dark/50 font-medium">Etiqueta</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bundleRows.map((b, i) => (
                    <tr key={i} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-bordo"
                          value={b.quantity}
                          min={1}
                          onChange={(e) => updateBundle(i, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-bordo"
                            value={b.discount_pct}
                            min={0}
                            max={90}
                            onChange={(e) => updateBundle(i, 'discount_pct', parseInt(e.target.value) || 0)}
                          />
                          <span className="text-dark/40 text-xs">%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="font-semibold text-bordo text-sm">
                          {basePrice ? formatCOP(b.price) : '—'}
                        </span>
                        {b.quantity > 1 && basePrice > 0 && (
                          <div className="text-xs text-dark/40">
                            {formatCOP(Math.round(b.price / b.quantity))} c/u
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-bordo"
                          value={b.label}
                          placeholder="Ej: Más popular"
                          onChange={(e) => updateBundle(i, 'label', e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2">
                        {bundleRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBundle(i)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {basePrice > 0 && (
              <p className="text-xs text-dark/40 mt-1.5">
                Los precios se recalculan automáticamente al cambiar el precio base o el % de descuento.
              </p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="form-label">URLs de imágenes</label>
            <div className="space-y-2">
              {form.images.map((img, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="url"
                    className="form-input flex-1"
                    value={img}
                    onChange={(e) => updateImage(i, e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                      className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm({ ...form, images: [...form.images, ''] })}
                className="flex items-center gap-2 text-bordo hover:text-bordo-light text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Agregar imagen
              </button>
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-dark text-sm">Producto activo</p>
              <p className="text-dark/50 text-xs">Visible en la tienda al activar</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.active ? 'bg-bordo' : 'bg-gray-300'}`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  form.active ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.price}
            className="btn-bordo flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Guardando...' : 'Guardar Producto'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-200 rounded-lg text-dark/60 hover:text-dark hover:border-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
