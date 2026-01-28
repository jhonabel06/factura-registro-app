export interface Invoice {
  id: string
  vendor: string
  description: string
  amount: number
  tax: number
  total: number
  date: string
  category: string
  imageUrl?: string
  createdAt: string
}

export interface InvoiceSummary {
  totalAmount: number
  totalTax: number
  grandTotal: number
  invoiceCount: number
  byCategory: Record<string, number>
}

export type TimeRange = 'day' | 'week' | 'month' | 'all'

// Tipos para autenticación y roles
export interface Role {
  id: string
  name: 'admin' | 'Caja' | 'Registrador'
  description?: string
  created_at?: string
  updated_at?: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  assigned_at?: string
  assigned_by?: string
  role?: Role
}

export interface UserWithRoles {
  id: string
  email: string
  roles: Role[]
  hasRole: (roleName: 'admin' | 'Caja' | 'Registrador') => boolean
}

export type RoleName = 'admin' | 'Caja' | 'Registrador'
