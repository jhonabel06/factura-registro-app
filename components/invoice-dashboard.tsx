"use client"

import {
  Receipt,
  TrendingUp,
  Calculator,
  PieChart,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { InvoiceSummary } from "@/lib/types"

interface InvoiceDashboardProps {
  summary: InvoiceSummary
  periodLabel: string
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(amount)
}

const categoryColors: Record<string, string> = {
  Alimentación: "bg-emerald-500",
  Transporte: "bg-blue-500",
  Servicios: "bg-amber-500",
  Oficina: "bg-slate-500",
  Tecnología: "bg-cyan-500",
  Salud: "bg-rose-500",
  Entretenimiento: "bg-fuchsia-500",
  Otros: "bg-gray-500",
}

export function InvoiceDashboard({
  summary,
  periodLabel,
}: InvoiceDashboardProps) {
  const sortedCategories = Object.entries(summary.byCategory).sort(
    ([, a], [, b]) => b - a
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total {periodLabel}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(summary.grandTotal)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subtotal
            </CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(summary.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Impuestos
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(summary.totalTax)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Facturas
            </CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {summary.invoiceCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {sortedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedCategories.map(([category, amount]) => {
                const percentage =
                  summary.grandTotal > 0
                    ? (amount / summary.grandTotal) * 100
                    : 0
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {category}
                      </span>
                      <span className="text-muted-foreground">
                        {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full ${categoryColors[category] || "bg-gray-500"}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
