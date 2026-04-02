import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Colombian Pesos
 * e.g. 35000 -> "$35.000"
 */
export function formatCOP(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format price per unit from a bundle
 */
export function pricePerUnit(totalPrice: number, quantity: number): number {
  return Math.round(totalPrice / quantity)
}

/**
 * Generate order number in format LLB-2024-XXXX
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(1000 + Math.random() * 9000)
  return `LLB-${year}-${random}`
}

/**
 * Calculate savings percentage
 */
export function savingsPercent(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100)
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Format date to Colombian locale
 */
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Format date short
 */
export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Get status label in Spanish
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    despachado: 'Despachado',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  }
  return labels[status] || status
}

/**
 * Get status color classes
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    confirmado: 'bg-blue-100 text-blue-800',
    despachado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Validate Colombian phone number
 */
export function validateColombianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  // Colombian mobile: 10 digits starting with 3
  // Or with country code: 57 + 10 digits
  return /^(57)?3\d{9}$/.test(cleaned)
}

/**
 * Get WhatsApp URL
 */
export function getWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const number = cleaned.startsWith('57') ? cleaned : `57${cleaned}`
  const encodedMessage = message ? encodeURIComponent(message) : ''
  return `https://wa.me/${number}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}
