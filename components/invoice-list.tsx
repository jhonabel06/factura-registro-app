"use client"

import { useState } from "react"
import { Trash2, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Invoice } from "@/lib/types"
import { deleteInvoice } from "@/lib/invoice-store"

interface InvoiceListProps {
  invoices: Invoice[]
  onDelete: () => void
}

const categoryColors: Record<string, string> = {
  Alimentación: "bg-emerald-100 text-emerald-800",
  Transporte: "bg-blue-100 text-blue-800",
  Servicios: "bg-amber-100 text-amber-800",
  Oficina: "bg-slate-100 text-slate-800",
  Tecnología: "bg-cyan-100 text-cyan-800",
  Salud: "bg-rose-100 text-rose-800",
  Entretenimiento: "bg-fuchsia-100 text-fuchsia-800",
  Otros: "bg-gray-100 text-gray-800",
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function InvoiceList({ invoices, onDelete }: InvoiceListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const success = await deleteInvoice(id)
      if (success) {
        onDelete()
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">
            No hay facturas registradas
          </p>
          <p className="text-sm text-muted-foreground/70">
            Sube una imagen para comenzar
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {invoices.map((invoice) => (
        <Card
          key={invoice.id}
          className="transition-shadow hover:shadow-md"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                {invoice.imageUrl && (
                  <img
                    src={invoice.imageUrl || "/placeholder.svg"}
                    alt="Factura"
                    className="h-16 w-16 rounded-md object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">
                      {invoice.vendor}
                    </h4>
                    <Badge
                      variant="secondary"
                      className={categoryColors[invoice.category] || ""}
                    >
                      {invoice.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {invoice.description}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(invoice.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(invoice.total)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    IVA: {formatCurrency(invoice.tax)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(invoice.id)}
                  disabled={deletingId === invoice.id}
                  className="text-muted-foreground hover:text-destructive"
                >
                  {deletingId === invoice.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Eliminar factura</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
