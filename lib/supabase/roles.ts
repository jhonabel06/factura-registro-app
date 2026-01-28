"use client"

import { createClient } from "./client"
import type { Role, UserRole, RoleName } from "@/lib/types"

const supabase = createClient()

/**
 * Obtener los roles de un usuario autenticado
 */
export async function getUserRoles(userId: string): Promise<Role[]> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role:roles(id, name, description)")
      .eq("user_id", userId)

    if (error) {
      console.error("Error fetching user roles:", error)
      return []
    }

    return data?.map((ur) => ur.role).filter(Boolean) || []
  } catch (error) {
    console.error("Error in getUserRoles:", error)
    return []
  }
}

/**
 * Verificar si un usuario tiene un rol específico
 */
export async function userHasRole(
  userId: string,
  roleName: RoleName
): Promise<boolean> {
  try {
    const roles = await getUserRoles(userId)
    return roles.some((r) => r.name === roleName)
  } catch (error) {
    console.error("Error checking user role:", error)
    return false
  }
}

/**
 * Obtener todos los usuarios con sus roles (solo admin)
 */
export async function getAllUsersWithRoles() {
  try {
    const { data: users, error: usersError } = await supabase
      .from("user_roles")
      .select("user_id")

    if (usersError) throw usersError

    const uniqueUserIds = Array.from(new Set(users?.map((u) => u.user_id) || []))

    const { data: userRolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id, role:roles(id, name, description)")
      .in("user_id", uniqueUserIds)

    if (rolesError) throw rolesError

    return userRolesData || []
  } catch (error) {
    console.error("Error fetching all users with roles:", error)
    return []
  }
}

/**
 * Asignar un rol a un usuario (solo admin)
 */
export async function assignRoleToUser(
  userId: string,
  roleName: RoleName
): Promise<{ success: boolean; error?: string }> {
  try {
    // Primero obtener el ID del rol
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single()

    if (roleError || !roleData) {
      return { success: false, error: "Rol no encontrado" }
    }

    // Verificar si ya tiene ese rol
    const { data: existing } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", userId)
      .eq("role_id", roleData.id)
      .single()

    if (existing) {
      return { success: false, error: "El usuario ya tiene este rol" }
    }

    // Asignar el rol
    const { error: insertError } = await supabase.from("user_roles").insert({
      user_id: userId,
      role_id: roleData.id,
    })

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error assigning role:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

/**
 * Remover un rol de un usuario (solo admin)
 */
export async function removeRoleFromUser(
  userId: string,
  roleName: RoleName
): Promise<{ success: boolean; error?: string }> {
  try {
    // Obtener el ID del rol
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single()

    if (roleError || !roleData) {
      return { success: false, error: "Rol no encontrado" }
    }

    // Remover el rol
    const { error: deleteError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role_id", roleData.id)

    if (deleteError) {
      return { success: false, error: deleteError.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Error removing role:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

/**
 * Obtener todos los roles disponibles
 */
export async function getAllRoles(): Promise<Role[]> {
  try {
    const { data, error } = await supabase
      .from("roles")
      .select("id, name, description")

    if (error) {
      console.error("Error fetching roles:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllRoles:", error)
    return []
  }
}
