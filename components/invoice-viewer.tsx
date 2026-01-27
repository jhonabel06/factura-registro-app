"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Invoice } from "@/lib/types"

interface InvoiceViewerProps {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceViewer({ invoice, open, onOpenChange }: InvoiceViewerProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    setImageLoaded(false)
  }, [open, invoice])

  const handleClose = () => {
    onOpenChange(false)
  }

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    if (open) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, handleClose])

  // Early return after all hooks
  if (!open || !invoice) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={handleClose}>
      {/* Contenedor de la imagen */}
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {invoice.imageUrl ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white/50">Cargando imagen...</div>
              </div>
            )}
            <img
              src={invoice.imageUrl}
              alt={`Factura de ${invoice.vendor}`}
              onLoad={() => setImageLoaded(true)}
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="text-white/50 text-center">
            <p className="text-lg">No hay imagen disponible</p>
            <p className="text-sm mt-2">{invoice.vendor}</p>
          </div>
        )}

        {/* Botón de cerrar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 hover:bg-white/10 text-white"
          aria-label="Cerrar visor"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Info rápida */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm max-w-xs">
          <p className="font-semibold">{invoice.vendor}</p>
          <p className="text-white/75">{invoice.description}</p>
        </div>
      </div>
    </div>
  )
}
