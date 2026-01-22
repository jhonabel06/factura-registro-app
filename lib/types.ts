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
