"use client"

import React from "react"

import { useState, useCallback } from "react"
import { Upload, Camera, Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

interface InvoiceUploadProps {
  onInvoiceSaved: () => void
}

export function InvoiceUpload({ onInvoiceSaved }: InvoiceUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [extractedData, setExtractedData] = useState<Partial<Invoice> | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)

  const processImage = useCallback(async (file: File) => {
    setIsProcessing(true)
    setError(null)

    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      setPreviewUrl(base64)

      try {
        const response = await fetch("/api/extract-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageData: base64,
            mediaType: file.type,
          }),
        })

        if (!response.ok) {
          throw new Error("Error al procesar la imagen")
        }

        const data = await response.json()
        setExtractedData(data.invoice)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error desconocido"
        )
      } finally {
        setIsProcessing(false)
      }
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith("image/")) {
        processImage(file)
      }
    },
    [processImage]
  )

  const handleSave = async () => {
    if (!extractedData) return

    setIsSaving(true)
    setError(null)

    try {
      const invoiceData = {
        vendor: extractedData.vendor || "Desconocido",
        description: extractedData.description || "",
        amount: extractedData.amount || 0,
        tax: extractedData.tax || 0,
        total: extractedData.total || 0,
        date: extractedData.date || new Date().toISOString().split("T")[0],
        category: extractedData.category || "Otros",
        imageUrl: previewUrl || undefined,
      }

      const result = await saveInvoice(invoiceData)
      
      if (result) {
        setExtractedData(null)
        setPreviewUrl(null)
        onInvoiceSaved()
      } else {
        setError("Error al guardar la factura en la base de datos")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setExtractedData(null)
    setPreviewUrl(null)
    setError(null)
  }

  const updateField = (field: keyof Invoice, value: string | number) => {
    setExtractedData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  if (extractedData) {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            {previewUrl && (
              <div className="lg:w-1/3">
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Factura"
                  className="w-full rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-1 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Datos Extraídos
              </h3>

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendedor</Label>
                  <Input
                    id="vendor"
                    value={extractedData.vendor || ""}
                    onChange={(e) => updateField("vendor", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    type="date"
                    value={extractedData.date || ""}
                    onChange={(e) => updateField("date", e.target.value)}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Input
                    id="description"
                    value={extractedData.description || ""}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Subtotal</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={extractedData.amount || 0}
                    onChange={(e) =>
                      updateField("amount", Number.parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax">Impuestos</Label>
                  <Input
                    id="tax"
                    type="number"
                    step="0.01"
                    value={extractedData.tax || 0}
                    onChange={(e) =>
                      updateField("tax", Number.parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total">Total</Label>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    value={extractedData.total || 0}
                    onChange={(e) =>
                      updateField("total", Number.parseFloat(e.target.value) || 0)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select
                    value={extractedData.category || "Otros"}
                    onValueChange={(value) => updateField("category", value)}
                  >
                    <SelectTrigger>
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
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? "Guardando..." : "Guardar Factura"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 bg-transparent"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50"
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Procesando factura con OCR...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" onClick={() => setError(null)}>
                Intentar de nuevo
              </Button>
            </div>
          ) : (
            <>
              <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="mb-2 text-lg font-medium text-foreground">
                Arrastra una imagen de factura aquí
              </p>
              <p className="mb-4 text-sm text-muted-foreground">
                o selecciona un archivo
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:justify-center">
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <label className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir archivo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </Button>
                <Button variant="outline" asChild className="w-full sm:w-auto">
                  <label className="cursor-pointer">
                    <Camera className="mr-2 h-4 w-4" />
                    Tomar foto
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
