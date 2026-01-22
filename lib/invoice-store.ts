import type { Invoice, InvoiceSummary, TimeRange } from "./types"
import { createClient } from "@/lib/supabase/client"

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .order("date", { ascending: false })
  
  if (error) {
    console.error("Error fetching invoices:", error)
    return []
  }
  
  return data.map(mapDbToInvoice)
}

export async function saveInvoice(invoice: Omit<Invoice, "id" | "createdAt">): Promise<Invoice | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from("invoices")
    .insert({
      vendor: invoice.vendor,
      description: invoice.description,
      subtotal: invoice.amount,
      tax: invoice.tax,
      total: invoice.total,
      date: invoice.date,
      category: invoice.category,
      image_url: invoice.imageUrl,
    })
    .select()
    .single()
  
  if (error) {
    console.error("Error saving invoice:", error)
    return null
  }
  
  return mapDbToInvoice(data)
}

export async function deleteInvoice(id: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
  
  if (error) {
    console.error("Error deleting invoice:", error)
    return false
  }
  
  return true
}

function mapDbToInvoice(dbRow: {
  id: string
  vendor: string
  description: string | null
  subtotal: number
  tax: number
  total: number
  date: string
  category: string
  image_url: string | null
  created_at: string
}): Invoice {
  return {
    id: dbRow.id,
    vendor: dbRow.vendor,
    description: dbRow.description || "",
    amount: dbRow.subtotal,
    tax: dbRow.tax,
    total: dbRow.total,
    date: dbRow.date,
    category: dbRow.category,
    imageUrl: dbRow.image_url || undefined,
    createdAt: dbRow.created_at,
  }
}

export function filterInvoicesByTimeRange(
  invoices: Invoice[],
  range: TimeRange
): Invoice[] {
  if (range === "all") return invoices

  const now = new Date()
  const startDate = new Date()

  switch (range) {
    case "day":
      startDate.setHours(0, 0, 0, 0)
      break
    case "week":
      startDate.setDate(now.getDate() - 7)
      break
    case "month":
      startDate.setMonth(now.getMonth() - 1)
      break
  }

  return invoices.filter((inv) => new Date(inv.date) >= startDate)
}

export function calculateSummary(invoices: Invoice[]): InvoiceSummary {
  const byCategory: Record<string, number> = {}

  let totalAmount = 0
  let totalTax = 0
  let grandTotal = 0

  for (const inv of invoices) {
    totalAmount += inv.amount
    totalTax += inv.tax
    grandTotal += inv.total
    byCategory[inv.category] = (byCategory[inv.category] || 0) + inv.total
  }

  return {
    totalAmount,
    totalTax,
    grandTotal,
    invoiceCount: invoices.length,
    byCategory,
  }
}

export function generateId(): string {
  return `inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}
