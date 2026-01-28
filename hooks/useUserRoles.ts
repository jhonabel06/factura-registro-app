'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Role, RoleName } from '@/lib/types'

interface UseUserRolesReturn {
  roles: Role[]
  isLoading: boolean
  hasRole: (roleName: RoleName) => boolean
  hasAnyRole: (roleNames: RoleName[]) => boolean
  isAdmin: boolean
}

export function useUserRoles(): UseUserRolesReturn {
  const supabase = createClient()
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setRoles([])
          setIsLoading(false)
          return
        }

        const { data: userRolesData, error } = await supabase
          .from('user_roles')
          .select('role_id, roles(id, name, description)')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching user roles:', error?.message || error)
          console.error('Full error:', JSON.stringify(error))
          setRoles([])
        } else {
          console.log('User roles data:', userRolesData)
          const rolesData = userRolesData?.map((ur: any) => ur.roles).filter(Boolean) || []
          console.log('Mapped roles:', rolesData)
          setRoles(rolesData)
        }
      } catch (error) {
        console.error('Error in useUserRoles:', error)
        setRoles([])
      } finally {
        setIsLoading(false)
      }
    }

    loadUserRoles()
  }, [supabase])

  const hasRole = (roleName: RoleName): boolean => {
    return roles.some((r) => r.name === roleName)
  }

  const hasAnyRole = (roleNames: RoleName[]): boolean => {
    return roleNames.some((roleName) => hasRole(roleName))
  }

  const isAdmin = hasRole('admin')

  return {
    roles,
    isLoading,
    hasRole,
    hasAnyRole,
    isAdmin,
  }
}
