'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: '¿A qué ciudades de Colombia hacen envíos?',
    a: 'Hacemos envíos a toda Colombia, incluyendo los 32 departamentos y Bogotá D.C. Llegamos a ciudades principales en 2-3 días hábiles y a municipios en 4-6 días hábiles.',
  },
  {
    q: '¿Puedo pagar contra entrega?',
    a: 'Sí, ofrecemos pago contra entrega (contraentrega) en todo el territorio colombiano. Solo pagas cuando recibes tu pedido. También puedes pagar en línea de forma segura.',
  },
  {
    q: '¿Cuánto cuesta el envío?',
    a: 'El envío es gratuito en pedidos de 2 o más unidades. Para pedidos de 1 unidad, el envío tiene un costo de $8.000 COP. El valor siempre se muestra antes de confirmar tu pedido.',
  },
  {
    q: '¿El colgante viene en caja de regalo?',
    a: 'Sí, todos nuestros colgantes vienen en un elegante estuche de regalo, perfecto para regalar a familiares y amigos. Ideal para cumpleaños, navidad o cualquier ocasión especial.',
  },
  {
    q: '¿De qué material está hecho?',
    a: 'El colgante Lluvia de Bendiciones está elaborado en aleación de zinc de alta calidad, bañado en oro. Es duradero, resistente a la humedad y mantiene su brillo por mucho tiempo.',
  },
  {
    q: '¿Cómo puedo rastrear mi pedido?',
    a: 'Una vez confirmado tu pedido, recibirás un número de orden (formato LLB-2024-XXXX). Puedes ingresar a nuestra página de seguimiento y consultar el estado en tiempo real. También te avisamos por WhatsApp.',
  },
  {
    q: '¿Tienen garantía de satisfacción?',
    a: 'Sí, ofrecemos garantía de satisfacción. Si el producto llega en mal estado o no es lo que esperabas, te hacemos el cambio o la devolución de tu dinero sin preguntas. Solo contáctanos dentro de los 15 días de recibido.',
  },
  {
    q: '¿Puedo pedir descuentos por mayor cantidad?',
    a: 'Absolutamente. Mientras más unidades compres, mayor es el descuento. Nuestro paquete de 6 unidades por $99.900 ofrece el mejor precio por unidad ($16.650 c/u vs $35.000 individual).',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gold/20 rounded-xl overflow-hidden">
      <button
        className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-gold/5 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-dark font-playfair pr-2">{q}</span>
        <ChevronDown
          size={20}
          className={`text-gold flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-dark/70 text-sm leading-relaxed border-t border-gold/10 pt-4 bg-gold/2">
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQ() {
  return (
    <section className="py-20 bg-cream" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="gold-divider mb-4">
            <span>✦ ✦ ✦</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-bordo mb-3">
            Preguntas Frecuentes
          </h2>
          <p className="text-dark/60">
            ¿Tienes dudas? Aquí respondemos las preguntas más comunes.
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-10 text-center p-6 bg-bordo/5 rounded-2xl border border-bordo/15">
          <p className="font-playfair font-semibold text-bordo text-lg mb-2">
            ¿Tienes otra pregunta?
          </p>
          <p className="text-dark/60 text-sm mb-4">
            Nuestro equipo está disponible por WhatsApp para ayudarte
          </p>
          <a
            href="https://wa.me/573001234567?text=Hola!%20Tengo%20una%20pregunta%20sobre%20Lluvia%20de%20Bendiciones"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Chatear por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
