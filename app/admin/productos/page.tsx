'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff, Package, RefreshCw } from 'lucide-react'
import ProductFormModal from '@/components/admin/ProductFormModal'
import type { Product, Bundle } from '@/lib/types'
import { formatCOP, formatDateShort } from '@/lib/utils'

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingBundles, setEditingBundles] = useState<Bundle[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/products?active=false')
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSave = async (formData: Partial<Product>) => {
    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : '/api/products'

    const method = editingProduct ? 'PATCH' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (!res.ok) {
      throw new Error('Error al guardar el producto')
    }

    await fetchProducts()
  }

  const handleToggleActive = async (product: Product) => {
    await fetch(`/api/products/${product.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !product.active }),
    })
    await fetchProducts()
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) return

    setDeleting(productId)
    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' })
      await fetchProducts()
    } finally {
      setDeleting(null)
    }
  }

  const handleEdit = async (product: Product) => {
    setEditingProduct(product)
    setEditingBundles([])
    try {
      const res = await fetch(`/api/products/${product.id}`)
      if (res.ok) {
        const data = await res.json()
        setEditingBundles(data.product?.bundles || [])
      }
    } catch { /* bundles quedarán vacíos, el modal usa defaults */ }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setEditingBundles([])
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-dark">
            Productos
          </h1>
          <p className="text-dark/50 text-sm mt-1">
            {products.length} producto{products.length !== 1 ? 's' : ''} en el catálogo
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 border border-gray-200 rounded-lg text-dark/50 hover:text-dark hover:border-gray-300 transition-colors"
            title="Actualizar"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => {
              setEditingProduct(null)
              setShowModal(true)
            }}
            className="btn-bordo flex items-center gap-2 text-sm px-4 py-2.5"
          >
            <Plus size={18} />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-64 border border-gray-100 shimmer" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Package size={48} className="mx-auto mb-4 text-gray-200" />
          <h3 className="font-playfair text-xl font-bold text-dark mb-2">
            Sin productos
          </h3>
          <p className="text-dark/50 text-sm mb-6">
            Agrega tu primer producto para empezar a vender
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-bordo inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar Producto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md
              ${product.active ? 'border-gray-100' : 'border-gray-100 opacity-70'}`}
            >
              {/* Product image */}
              <div className="aspect-video bg-gradient-to-br from-bordo-dark to-bordo flex items-center justify-center relative">
                <span className="text-gold text-5xl">✝</span>
                {!product.active && (
                  <div className="absolute inset-0 bg-dark/50 flex items-center justify-center">
                    <span className="bg-dark/80 text-cream text-xs font-bold px-3 py-1.5 rounded-full">
                      INACTIVO
                    </span>
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-playfair font-bold text-dark text-base leading-tight">
                    {product.name}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                    ${product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                  >
                    {product.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {product.short_description && (
                  <p className="text-dark/60 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {product.short_description}
                  </p>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <p className="text-xs text-dark/40">Precio</p>
                    <p className="font-bold text-bordo">{formatCOP(product.price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-dark/40">Stock</p>
                    <p className={`font-bold ${product.stock <= 10 ? 'text-red-600' : 'text-dark'}`}>
                      {product.stock} uds.
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-dark/40">Actualizado</p>
                    <p className="text-xs text-dark/60">{formatDateShort(product.updated_at)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 border border-gray-200 rounded-lg hover:border-bordo hover:text-bordo transition-colors"
                  >
                    <Pencil size={13} />
                    Editar
                  </button>

                  <button
                    onClick={() => handleToggleActive(product)}
                    className="flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 border border-gray-200 rounded-lg hover:border-gold hover:text-gold transition-colors"
                    title={product.active ? 'Desactivar' : 'Activar'}
                  >
                    {product.active ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deleting === product.id}
                    className="flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 border border-gray-200 rounded-lg hover:border-red-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    {deleting === product.id ? (
                      <div className="w-3 h-3 border border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductFormModal
          product={editingProduct}
          bundles={editingBundles}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
