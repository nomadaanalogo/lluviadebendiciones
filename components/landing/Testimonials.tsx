import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'María Fernández',
    city: 'Bogotá, D.C.',
    rating: 5,
    text: 'Hermoso colgante, lo recibí muy bien empacado. Desde que lo puse en mi carro siento mucha paz al manejar. Lo recomiendo 100%. La calidad es excelente y se nota que fue hecho con amor.',
    initials: 'MF',
    verified: true,
    date: 'Hace 2 semanas',
  },
  {
    name: 'Carlos Rodríguez',
    city: 'Medellín, Antioquia',
    rating: 5,
    text: 'Compré 4 para toda la familia. La calidad es excelente y el detalle del diseño es precioso. Llegó en 3 días a Medellín sin ningún problema. Un regalo espiritual perfecto.',
    initials: 'CR',
    verified: true,
    date: 'Hace 1 mes',
  },
  {
    name: 'Ana Lucía Moreno',
    city: 'Cali, Valle del Cauca',
    rating: 5,
    text: 'Un regalo perfecto para mi esposo. Le encantó y dice que ya no maneja sin su protección. El empaque de regalo es muy bonito. Definitivamente volvería a comprar.',
    initials: 'AL',
    verified: true,
    date: 'Hace 3 semanas',
  },
  {
    name: 'Jorge Alberto Pérez',
    city: 'Bucaramanga, Santander',
    rating: 5,
    text: 'Tuve un accidente leve y gracias a Dios y a mi colgante estamos bien. Fe y protección divina siempre. Muy recomendado para todos los conductores colombianos.',
    initials: 'JP',
    verified: true,
    date: 'Hace 2 meses',
  },
  {
    name: 'Sandra Milena Castro',
    city: 'Barranquilla, Atlántico',
    rating: 4,
    text: 'Muy bonito el producto. El envío tardó un poco más de lo esperado pero valió la pena la espera. La atención al cliente por WhatsApp fue excelente, muy amables.',
    initials: 'SM',
    verified: true,
    date: 'Hace 6 semanas',
  },
  {
    name: 'Luis Eduardo Vargas',
    city: 'Pereira, Risaralda',
    rating: 5,
    text: 'Compré 6 para regalar en navidad a toda la familia. A todos les encantó. El precio es muy justo para la calidad que se recibe. Ya pedí más para amigos.',
    initials: 'LV',
    verified: true,
    date: 'Hace 5 semanas',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'text-gold' : 'text-gray-200'}
          fill={i < rating ? '#C9A84C' : '#e5e7eb'}
        />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 bg-bordo-dark/5 bg-cross-pattern" id="testimonios">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="gold-divider mb-4">
            <span>✦ ✦ ✦</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-bordo mb-3">
            Lo Que Dicen Nuestras Familias
          </h2>
          <p className="text-dark/60 max-w-xl mx-auto mb-6">
            Más de 2,847 familias colombianas confían en Lluvia de Bendiciones
            para proteger sus caminos.
          </p>

          {/* Overall rating */}
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-sm border border-gold/15">
            <div className="text-center">
              <div className="text-4xl font-bold text-bordo font-playfair">4.9</div>
              <div className="flex gap-0.5 justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#C9A84C" className="text-gold" />
                ))}
              </div>
            </div>
            <div className="h-12 w-px bg-gold/20" />
            <div className="text-left">
              <p className="font-semibold text-dark">Calificación general</p>
              <p className="text-dark/50 text-sm">Basado en 384 reseñas</p>
            </div>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(({ name, city, rating, text, initials, verified, date }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gold/15 hover:border-gold/30 hover:shadow-gold transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <Quote size={24} className="text-gold/20 absolute top-4 right-4" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-bordo text-cream font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-dark text-sm truncate">{name}</p>
                    {verified && (
                      <span className="text-green-500 text-xs bg-green-50 px-1.5 py-0.5 rounded font-medium flex-shrink-0">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-dark/50 text-xs">{city}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <StarRating rating={rating} />
                <span className="text-dark/40 text-xs">{date}</span>
              </div>

              {/* Review text */}
              <p className="text-dark/70 text-sm leading-relaxed">&ldquo;{text}&rdquo;</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-dark/60 text-sm mb-4">
            ¿Ya tienes tu Lluvia de Bendiciones? Comparte tu experiencia
          </p>
          <a
            href="https://wa.me/573001234567?text=Quiero%20compartir%20mi%20experiencia%20con%20Lluvia%20de%20Bendiciones"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm border border-green-200 hover:border-green-300 px-5 py-2.5 rounded-lg transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Escríbenos tu reseña por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
