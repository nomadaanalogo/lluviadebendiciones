import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { id } = params

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)

    let query = supabase.from('products').select('*, bundles(*)')

    if (isUUID) {
      query = query.eq('id', id)
    } else {
      query = query.eq('slug', id)
    }

    const { data: product, error } = await query.single()

    if (error || !product) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Error al obtener el producto' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    const allowedFields = [
      'name', 'slug', 'description', 'short_description',
      'price', 'images', 'stock', 'active',
    ]

    const updates: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field]
      }
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update bundles if provided
    if (Array.isArray(body.bundles) && body.bundles.length > 0) {
      await supabase.from('bundles').delete().eq('product_id', id)
      await supabase.from('bundles').insert(
        body.bundles.map((b: { quantity: number; price: number; label: string; badge: string }) => ({
          product_id: id,
          quantity: b.quantity,
          price: b.price,
          label: b.label || null,
          badge: b.badge || null,
          active: true,
        }))
      )
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error('PATCH /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = params

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 })
  }
}
