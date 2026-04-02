import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') !== 'false'

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('active', true)
    }

    const { data: products, error } = await query

    if (error) throw error

    return NextResponse.json({ products })
  } catch (error) {
    console.error('GET /api/products error:', error)
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        short_description: body.short_description || null,
        price: body.price,
        images: body.images || [],
        stock: body.stock || 0,
        active: body.active ?? true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    console.error('POST /api/products error:', error)
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
  }
}
