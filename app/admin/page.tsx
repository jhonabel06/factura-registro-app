'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import {
  assignRoleToUser,
  removeRoleFromUser,
  getAllRoles,
} from '@/lib/supabase/roles'
import type { Role } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface UserWithRoles {
  user_id: string
  email?: string
  user_email?: string
  roles: Array<{ name: string; description?: string }>
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Record<string, string>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // Obtener todos los roles
      const rolesData = await getAllRoles()
      setRoles(rolesData)

      // Obtener usuarios desde la API
      const response = await fetch('/api/users')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al obtener usuarios')
      }
      
      const { users: usersWithRoles } = await response.json()
      setUsers(usersWithRoles)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignRole = async (userId: string, roleName: string) => {
    try {
      const result = await assignRoleToUser(userId, roleName as any)
      if (result.success) {
        toast.success(`Rol "${roleName}" asignado correctamente`)
        await loadData()
        setSelectedRole({ ...selectedRole, [userId]: '' })
      } else {
        toast.error(result.error || 'Error al asignar el rol')
      }
    } catch (error) {
      console.error('Error assigning role:', error)
      toast.error('Error inesperado')
    }
  }

  const handleRemoveRole = async (userId: string, roleName: string) => {
    try {
      const result = await removeRoleFromUser(userId, roleName as any)
      if (result.success) {
        toast.success(`Rol "${roleName}" removido correctamente`)
        await loadData()
      } else {
        toast.error(result.error || 'Error al remover el rol')
      }
    } catch (error) {
      console.error('Error removing role:', error)
      toast.error('Error inesperado')
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="FacturaOCR"
        description="Gestión de Usuarios y Roles"
      />
      
      <div className="container py-4 md:py-8 md:ml-48 px-4 md:px-6">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Gestión de Usuarios y Roles</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Asigna y gestiona los roles de los usuarios del sistema
        </p>
      </div>

      {users.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No hay usuarios registrados
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {users.map((user) => (
            <Card key={user.user_id}>
              <CardHeader className="pb-3 md:pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="min-w-0">
                    <CardTitle className="text-base md:text-lg truncate">{user.email}</CardTitle>
                    <CardDescription className="text-xs md:text-sm mt-1 truncate">
                      ID: {user.user_id.substring(0, 8)}...
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {user.roles.length === 0 ? (
                      <Badge variant="destructive" className="text-xs">Sin rol</Badge>
                    ) : (
                      user.roles.map((role) => (
                        <Badge key={role.name} variant="default" className="text-xs">
                          {role.name}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Remover roles actuales */}
                  {user.roles.length > 0 && (
                    <div>
                      <p className="text-xs md:text-sm font-medium mb-2">Roles actuales:</p>
                      <div className="flex gap-2 flex-wrap">
                        {user.roles.map((role) => (
                          <Button
                            key={role.name}
                            variant="outline"
                            size="sm"
                            className="text-xs h-8"
                            onClick={() => handleRemoveRole(user.user_id, role.name)}
                          >
                            {role.name} ✕
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Asignar nuevo rol */}
                  <div>
                    <p className="text-xs md:text-sm font-medium mb-2">Asignar nuevo rol:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Select
                        value={selectedRole[user.user_id] || ''}
                        onValueChange={(value) =>
                          setSelectedRole({ ...selectedRole, [user.user_id]: value })
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[200px] h-9">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.name}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        className="w-full sm:w-auto h-9"
                        onClick={() => {
                          const selected = selectedRole[user.user_id]
                          if (selected) {
                            handleAssignRole(user.user_id, selected)
                          }
                        }}
                        disabled={!selectedRole[user.user_id]}
                      >
                        Asignar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  )
}
