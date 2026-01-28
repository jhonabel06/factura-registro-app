"use client"

import { useRouter } from "next/navigation"
import { InvoiceForm } from "@/components/invoice-form"
import { PageHeader } from "@/components/PageHeader"

export default function RegisterInvoicePage() {
  const router = useRouter()

  const handleSuccess = () => {
    setTimeout(() => {
      router.push("/")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="FacturaOCR"
        description="Registro inteligente de facturas"
      />

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
