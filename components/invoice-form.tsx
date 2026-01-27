"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Check } from "lucide-react"
import type { Invoice } from "@/lib/types"
import { saveInvoice } from "@/lib/invoice-store"

const CATEGORIES = [
  "Alimentación",
  "Transporte",
  "Servicios",
  "Oficina",
  "Tecnología",
  "Salud",
  "Entretenimiento",
  "Otros",
]

interface InvoiceFormProps {
  onSuccess?: () => void
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    vendor: "",
    description: "",
    amount: "",
    tax: "",
    date: new Date().toISOString().split("T")[0],
    category: "Otros",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const validateForm = () => {
    if (!formData.vendor.trim()) return "El nombre del proveedor es requerido"
    if (!formData.amount || isNaN(Number(formData.amount))) return "El monto es requerido y debe ser un número"
    if (Number(formData.amount) <= 0) return "El monto debe ser mayor a 0"
    if (!formData.date) return "La fecha es requerida"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      const amount = Number(formData.amount)
      const tax = Number(formData.tax) || 0

      const invoice: Partial<Invoice> = {
        vendor: formData.vendor.trim(),
        description: formData.description.trim(),
        amount,
        tax,
        total: amount + tax,
        date: formData.date,
        category: formData.category,
      }

      await saveInvoice(invoice as Invoice)

      setSuccess(true)
      setFormData({
        vendor: "",
        description: "",
        amount: "",
        tax: "",
        date: new Date().toISOString().split("T")[0],
        category: "Otros",
      })

      if (onSuccess) onSuccess()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar la factura")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Registrar Nueva Factura</CardTitle>
          <CardDescription>
            Completa los datos de la factura manualmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500 bg-green-50">
                <Check className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Factura registrada exitosamente
                </AlertDescription>
              </Alert>
            )}

            {/* Proveedor */}
            <div>
              <Label htmlFor="vendor" className="text-sm font-medium">
                Proveedor / Empresa *
              </Label>
              <Input
                id="vendor"
                name="vendor"
                placeholder="Ej: Supermercado XYZ"
                value={formData.vendor}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Descripción */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detalles de la compra (opcional)"
                value={formData.description}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Monto */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Monto (sin ITBIS) *
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              {/* ITBIS */}
              <div>
                <Label htmlFor="tax" className="text-sm font-medium">
                  ITBIS
                </Label>
                <Input
                  id="tax"
                  name="tax"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.tax}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Total */}
            {formData.amount && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm font-medium text-gray-700">
                  Total: DOP {(Number(formData.amount) + Number(formData.tax || 0)).toFixed(2)}
                </p>
              </div>
            )}

            {/* Fecha */}
            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                Fecha *
              </Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            {/* Categoría */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium">
                Categoría
              </Label>
              <Select value={formData.category} onValueChange={handleSelectChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Registrar Factura"
                )}
              </Button>
              <Link href="/">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
