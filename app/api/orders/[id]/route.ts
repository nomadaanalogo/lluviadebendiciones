import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { OrderStatus } from '@/lib/types'

const VALID_STATUSES: OrderStatus[] = [
  'pendiente',
  'confirmado',
  'despachado',
  'entregado',
  'cancelado',
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params

    // Try by UUID first, then by order_number
    let query = supabase
      .from('orders')
      .select('*, order_items(*)')

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    if (isUUID) {
      query = query.eq('id', id)
    } else {
      query = query.eq('order_number', id.toUpperCase())
    }

    const { data: order, error } = await query.single()

    if (error || !order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('GET /api/orders/[id] error:', error)
    return NextResponse.json({ error: 'Error al obtener el pedido' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params
    const body = await request.json()

    const updates: Record<string, unknown> = {}

    if (body.status) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
      }
      updates.status = body.status
    }

    if (body.notes !== undefined) updates.notes = body.notes

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('PATCH /api/orders/[id] error:', error)
    return NextResponse.json({ error: 'Error al actualizar el pedido' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/orders/[id] error:', error)
    return NextResponse.json({ error: 'Error al eliminar el pedido' }, { status: 500 })
  }
}
