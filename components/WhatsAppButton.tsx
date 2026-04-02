'use client'

import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phone?: string
  message?: string
}

export default function WhatsAppButton({
  phone = '573001234567',
  message = 'Hola! Me interesa el colgante Lluvia de Bendiciones para mi carro. ¿Podrían darme más información?',
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300 hover:scale-110 whatsapp-pulse no-print"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} fill="white" />
    </a>
  )
}
