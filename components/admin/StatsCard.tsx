import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  variant?: 'default' | 'gold' | 'bordo' | 'green'
}

const variantStyles = {
  default: 'bg-white border-gray-100',
  gold: 'bg-gradient-to-br from-gold/10 to-gold/5 border-gold/25',
  bordo: 'bg-gradient-to-br from-bordo/10 to-bordo/5 border-bordo/25',
  green: 'bg-gradient-to-br from-green-50 to-green-50/50 border-green-100',
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 border shadow-sm transition-shadow hover:shadow-md',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-dark/50 text-xs font-medium uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold text-dark font-playfair">{value}</p>
          {subtitle && (
            <p className="text-dark/50 text-xs mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-xs font-semibold',
                  trend.value >= 0 ? 'text-green-600' : 'text-red-500'
                )}
              >
                {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-dark/40 text-xs">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
