import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/register']

// Rutas que requieren roles específicos
const roleRoutes: Record<string, string[]> = {
  '/': ['admin', 'Registrador', 'Caja'], // Home/Dashboard requiere rol
  '/admin': ['admin'],
  '/dashboard': ['admin', 'Registrador'],
  '/register-invoice': ['admin', 'Registrador'],
  '/pos': ['admin', 'Caja', 'Registrador'],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acceso a rutas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Si no hay usuario y la ruta requiere autenticación, redirigir a login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Verificar roles si la ruta requiere un rol específico
  const requiredRoles = roleRoutes[pathname]
  if (requiredRoles && requiredRoles.length > 0) {
    // Obtener los roles del usuario
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role_id, roles(name)')
      .eq('user_id', user.id)

    const userRoleNames = userRoles?.map((ur: any) => ur.roles?.name) || []

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoleNames.includes(role)
    )

    if (!hasRequiredRole) {
      // Si el usuario no tiene rol, redirigir a una página de sin rol
      if (userRoleNames.length === 0) {
        const url = request.nextUrl.clone()
        url.pathname = '/no-role'
        return NextResponse.redirect(url)
      }

      // Si tiene rol pero no el requerido, redirigir al dashboard
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
