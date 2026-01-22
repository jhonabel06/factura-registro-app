"use client"

import { useState, useEffect, useCallback } from "react"
import { Receipt } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceUpload } from "@/components/invoice-upload"
import { InvoiceList } from "@/components/invoice-list"
import { InvoiceDashboard } from "@/components/invoice-dashboard"
import type { Invoice, TimeRange } from "@/lib/types"
import {
  getInvoices,
  filterInvoicesByTimeRange,
  calculateSummary,
} from "@/lib/invoice-store"

const TIME_RANGES: { value: TimeRange; label: string; periodLabel: string }[] = [
  { value: "day", label: "Hoy", periodLabel: "del Día" },
  { value: "week", label: "Semana", periodLabel: "Semanal" },
  { value: "month", label: "Mes", periodLabel: "Mensual" },
  { value: "all", label: "Todo", periodLabel: "Total" },
]

export default function InvoiceApp() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("month")
  const [isLoading, setIsLoading] = useState(true)

  const loadInvoices = useCallback(async () => {
    setIsLoading(true)
    try {
      const allInvoices = await getInvoices()
      setInvoices(allInvoices)
    } catch (error) {
      console.error("Error loading invoices:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 animate-pulse text-primary" />
          <span className="text-lg text-muted-foreground">Cargando facturas...</span>
        </div>
      </div>
    )
  }

  const filteredInvoices = filterInvoicesByTimeRange(invoices, timeRange)
  const summary = calculateSummary(filteredInvoices)
  const currentTimeRange = TIME_RANGES.find((t) => t.value === timeRange)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Receipt className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">FacturaOCR</h1>
              <p className="text-xs text-muted-foreground">
                Registro inteligente de facturas
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 space-y-6">
          <InvoiceUpload onInvoiceSaved={loadInvoices} />
        </div>

        <Tabs
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            {TIME_RANGES.map((range) => (
              <TabsTrigger key={range.value} value={range.value}>
                {range.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TIME_RANGES.map((range) => (
            <TabsContent key={range.value} value={range.value} className="space-y-6">
              <InvoiceDashboard
                summary={summary}
                periodLabel={range.periodLabel}
              />

              <div>
                <h2 className="mb-4 text-lg font-semibold text-foreground">
                  Facturas {range.periodLabel}
                </h2>
                <InvoiceList
                  invoices={filteredInvoices}
                  onDelete={loadInvoices}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
