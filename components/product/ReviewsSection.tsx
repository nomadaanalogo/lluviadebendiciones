'use client'

import { useState } from 'react'
import { Star, ThumbsUp } from 'lucide-react'
import type { Review } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ReviewsSectionProps {
  reviews: Review[]
  productId: string
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? 'text-gold' : 'text-gray-200'}
          fill={i < rating ? '#C9A84C' : '#e5e7eb'}
        />
      ))}
    </div>
  )
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          <Star
            size={28}
            className="transition-colors"
            style={{ color: star <= (hover || value) ? '#C9A84C' : '#e5e7eb' }}
            fill={star <= (hover || value) ? '#C9A84C' : '#e5e7eb'}
          />
        </button>
      ))}
    </div>
  )
}

const ratingBreakdown = [
  { stars: 5, count: 318, pct: 83 },
  { stars: 4, count: 46, pct: 12 },
  { stars: 3, count: 12, pct: 3 },
  { stars: 2, count: 5, pct: 1 },
  { stars: 1, count: 3, pct: 1 },
]

export default function ReviewsSection({ reviews, productId }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    customer_name: '',
    rating: 5,
    comment: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product_id: productId }),
      })

      if (res.ok) {
        setSubmitted(true)
        setShowForm(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-12">
      <div className="gold-divider mb-8">
        <span>✦ ✦ ✦</span>
      </div>

      <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-bordo mb-8 text-center">
        Reseñas de Clientes
      </h2>

      {/* Rating summary */}
      <div className="bg-cream rounded-2xl p-6 border border-gold/15 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-bordo font-playfair">4.9</div>
            <StarRating rating={5} size={20} />
            <p className="text-dark/50 text-sm mt-2">Basado en 384 reseñas</p>
          </div>
          <div className="space-y-2">
            {ratingBreakdown.map(({ stars, count, pct }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm text-dark/60 w-6 text-right">{stars}</span>
                <Star size={12} fill="#C9A84C" className="text-gold flex-shrink-0" />
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gold h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm text-dark/50 w-10 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4 mb-8">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl p-5 border border-gold/15"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bordo text-cream font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {review.customer_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{review.customer_name}</p>
                    <p className="text-dark/40 text-xs">{formatDate(review.created_at)}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <StarRating rating={review.rating} />
                </div>
              </div>
              {review.comment && (
                <p className="text-dark/70 text-sm leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-green-600 text-xs bg-green-50 border border-green-100 px-2 py-0.5 rounded font-medium">
                  ✓ Compra verificada
                </span>
                <button className="flex items-center gap-1 text-dark/40 hover:text-dark/70 text-xs transition-colors ml-2">
                  <ThumbsUp size={12} />
                  Útil
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-dark/50">
            <Star size={32} className="mx-auto mb-3 text-gold/40" />
            <p>Sé el primero en dejar una reseña</p>
          </div>
        )}
      </div>

      {/* Write review */}
      {!submitted ? (
        <div>
          {!showForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="btn-bordo inline-flex items-center gap-2"
              >
                <Star size={18} />
                Escribir una Reseña
              </button>
            </div>
          ) : (
            <div className="bg-cream rounded-2xl p-6 border border-gold/15">
              <h3 className="font-playfair font-bold text-bordo text-lg mb-5">
                Tu Reseña
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Tu nombre *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Ej: María Fernández"
                    value={form.customer_name}
                    onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Calificación *</label>
                  <StarInput
                    value={form.rating}
                    onChange={(v) => setForm({ ...form, rating: v })}
                  />
                </div>
                <div>
                  <label className="form-label">Tu experiencia</label>
                  <textarea
                    rows={4}
                    className="form-input resize-none"
                    placeholder="Cuéntanos cómo fue tu experiencia con el producto..."
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-bordo flex-1 disabled:opacity-70"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Reseña'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 border border-gray-200 rounded-lg text-dark/60 hover:text-dark transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-green-50 rounded-2xl border border-green-200">
          <div className="text-4xl mb-3">🙏</div>
          <p className="font-playfair font-bold text-green-700 text-lg">
            ¡Gracias por tu reseña!
          </p>
          <p className="text-green-600 text-sm mt-1">
            Tu opinión será publicada después de ser revisada.
          </p>
        </div>
      )}
    </section>
  )
}
