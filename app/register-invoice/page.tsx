"use client"

import { useRouter } from "next/navigation"
import { InvoiceForm } from "@/components/invoice-form"
import { Receipt } from "lucide-react"

export default function RegisterInvoicePage() {
  const router = useRouter()

  const handleSuccess = () => {
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Registrar Factura</h2>
          <p className="text-muted-foreground">
            Ingresa los datos de tu factura de manera manual
          </p>
        </div>

        <InvoiceForm onSuccess={handleSuccess} />
      </main>
    </div>
  )
}
