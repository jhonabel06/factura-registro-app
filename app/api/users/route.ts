import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Usar SERVICE_ROLE_KEY para operaciones de admin
    const supabase = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Obtener usuarios de auth con permisos de admin (desde servidor)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message || 'Error al obtener usuarios' },
        { status: 401 }
      )
    }

    if (!authUsers || !authUsers.users) {
      return NextResponse.json(
        { error: 'No users found' },
        { status: 200 }
      )
    }

    // Obtener los roles de cada usuario
    const usersWithRoles = []
    for (const authUser of authUsers.users) {
      const { data: userRolesData } = await supabase
        .from('user_roles')
        .select('role:roles(name, description)')
        .eq('user_id', authUser.id)

      usersWithRoles.push({
        user_id: authUser.id,
        email: authUser.email,
        roles: userRolesData?.map((ur: any) => ur.role) || [],
      })
    }

    return NextResponse.json({ users: usersWithRoles })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error al obtener usuarios' },
      { status: 500 }
    )
  }
}
