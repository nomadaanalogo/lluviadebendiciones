export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  images: string[] | null
  stock: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Bundle {
  id: string
  product_id: string
  quantity: number
  price: number
  label: string | null
  badge: string | null
  active: boolean
}

export type OrderStatus = 'pendiente' | 'confirmado' | 'despachado' | 'entregado' | 'cancelado'
export type PaymentMethod = 'contraentrega' | 'pago_inmediato'

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  customer_city: string
  customer_department: string
  customer_address: string
  payment_method: PaymentMethod
  status: OrderStatus
  subtotal: number
  shipping: number
  total: number
  notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
}

export interface Review {
  id: string
  product_id: string
  customer_name: string
  rating: number
  comment: string | null
  approved: boolean
  created_at: string
}

export interface CreateOrderPayload {
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_city: string
  customer_department: string
  customer_address: string
  payment_method: PaymentMethod
  notes?: string
  items: {
    product_id: string
    product_name: string
    quantity: number
    unit_price: number
    total_price: number
  }[]
}

export interface CartItem {
  product: Product
  bundle: Bundle
  quantity: number
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  ordersByStatus: Record<OrderStatus, number>
  recentOrders: Order[]
  todayOrders: number
  todayRevenue: number
}
