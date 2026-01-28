"use client"

import { Receipt } from "lucide-react"

interface PageHeaderProps {
  title?: string
  description?: string
}

export function PageHeader({ 
  title = "FacturaOCR",
  description = "Registro inteligente de facturas"
}: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-full items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Receipt className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
