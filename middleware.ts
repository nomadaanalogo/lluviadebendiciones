import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Solo actuar en rutas /admin
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!isAdminRoute) {
    return NextResponse.next()
  }

  try {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (!user && !isLoginPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    if (user && isLoginPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    // Si falla la conexión a Supabase, redirigir a login en lugar de crashear
    if (!isLoginPage) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
