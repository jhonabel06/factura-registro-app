// lib/supabase/server-auth.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { RoleName } from '@/lib/types'

export async function getServerUser() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Handle cookie setting errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete(name)
          } catch {
            // Handle cookie deletion errors
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function getUserRoles(userId: string) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set(name, value, options)
          } catch {
            // Handle cookie setting errors
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete(name)
          } catch {
            // Handle cookie deletion errors
          }
        },
      },
    }
  )

  const { data: userRolesData, error } = await supabase
    .from('user_roles')
    .select('role:roles(id, name, description)')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching user roles:', error)
    return []
  }

  return userRolesData?.map((ur: any) => ur.role).filter(Boolean) || []
}

export async function userHasRole(userId: string, roleName: RoleName) {
  const roles = await getUserRoles(userId)
  return roles.some((r) => r.name === roleName)
}

export async function userHasAnyRole(userId: string, roleNames: RoleName[]) {
  const roles = await getUserRoles(userId)
  return roleNames.some((roleName) => roles.some((r) => r.name === roleName))
}

export async function requireAdmin() {
  const user = await getServerUser()

  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  const isAdmin = await userHasRole(user.id, 'admin')

  if (!isAdmin) {
    throw new Error('No tienes permiso para acceder a este recurso')
  }

  return user
}

export async function requireRole(...roleNames: RoleName[]) {
  const user = await getServerUser()

  if (!user) {
    throw new Error('Usuario no autenticado')
  }

  const hasRole = await userHasAnyRole(user.id, roleNames)

  if (!hasRole) {
    throw new Error('No tienes permiso para acceder a este recurso')
  }

  return user
}
