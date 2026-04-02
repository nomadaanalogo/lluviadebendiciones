import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    if (!body.customer_name || !body.rating || !body.product_id) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: 'La calificación debe ser entre 1 y 5' }, { status: 400 })
    }

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id: body.product_id,
        customer_name: body.customer_name,
        rating: body.rating,
        comment: body.comment || null,
        approved: false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, review }, { status: 201 })
  } catch (error) {
    console.error('POST /api/reviews error:', error)
    return NextResponse.json({ error: 'Error al enviar la reseña' }, { status: 500 })
  }
}
