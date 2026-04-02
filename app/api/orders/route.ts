import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateOrderNumber } from '@/lib/utils'
import type { CreateOrderPayload } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')
    const page = parseInt(searchParams.get('page') || '1')
    const offset = (page - 1) * limit

    let query = supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error, count } = await query

    if (error) throw error

    return NextResponse.json({ orders, total: count })
  } catch (error) {
    console.error('GET /api/orders error:', error)
    return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body: CreateOrderPayload = await request.json()

    // Validate required fields
    if (!body.customer_name || !body.customer_phone || !body.customer_city ||
        !body.customer_department || !body.customer_address || !body.payment_method) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'El pedido debe tener al menos un producto' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = body.items.reduce((sum, item) => sum + item.total_price, 0)
    const totalQty = body.items.reduce((sum, item) => sum + item.quantity, 0)
    const shipping = totalQty >= 2 ? 0 : 8000
    const total = subtotal + shipping

    // Generate unique order number (retry on collision)
    let order_number = generateOrderNumber()
    let attempts = 0
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', order_number)
        .single()

      if (!existing) break
      order_number = generateOrderNumber()
      attempts++
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        customer_email: body.customer_email || null,
        customer_city: body.customer_city,
        customer_department: body.customer_department,
        customer_address: body.customer_address,
        payment_method: body.payment_method,
        status: 'pendiente',
        subtotal,
        shipping,
        total,
        notes: body.notes || null,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json(
      {
        success: true,
        order_number: order.order_number,
        order_id: order.id,
        total: order.total,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/orders error:', error)
    return NextResponse.json({ error: 'Error al crear el pedido' }, { status: 500 })
  }
}
