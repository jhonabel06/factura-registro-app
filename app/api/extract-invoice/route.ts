import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const invoiceSchema = z.object({
  vendor: z
    .string()
    .describe("Nombre del vendedor, comercio o empresa que emitió la factura"),
  description: z
    .string()
    .describe("Descripción breve de los productos o servicios"),
  amount: z.number().describe("Monto subtotal antes de impuestos"),
  tax: z.number().describe("Monto de impuestos (IVA, etc.)"),
  total: z.number().describe("Monto total de la factura"),
  date: z
    .string()
    .describe("Fecha de la factura en formato YYYY-MM-DD"),
  category: z
    .string()
    .describe(
      "Categoría del gasto: Alimentación, Transporte, Servicios, Oficina, Tecnología, Salud, Entretenimiento, Otros"
    ),
})

export async function POST(req: Request) {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY no está configurada")
      return Response.json(
        { error: "La API key de Google no está configurada. Reinicia el servidor de desarrollo." },
        { status: 500 }
      )
    }

    const { imageData, mediaType } = await req.json()

    if (!imageData) {
      return Response.json(
        { error: "No se proporcionó imagen" },
        { status: 400 }
      )
    }

    console.log("Procesando imagen con Gemini...")

    const { object } = await generateObject({
      model: google("gemini-3-flash-preview"),
      schema: invoiceSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza esta imagen de factura/recibo y extrae la información. 
              Si no puedes determinar algún valor, usa estos valores por defecto:
              - vendor: "Desconocido"
              - description: "Sin descripción"
              - amount: el total menos impuestos estimados (si solo hay total, usa 85% del total)
              - tax: impuestos (si solo hay total, usa 15% del total)
              - total: monto total
              - date: fecha de hoy en formato YYYY-MM-DD
              - category: "Otros"
              
              Asegúrate de que los montos sean números válidos sin símbolos de moneda.`,
            },
            {
              type: "image",
              image: imageData,
            },
          ],
        },
      ],
    })

    console.log("Extracción exitosa:", object)
    return Response.json({ invoice: object })
  } catch (error) {
    console.error("Error extracting invoice:", error)
    
    // Mensaje más detallado del error
    const errorMessage = error instanceof Error ? error.message : "Error desconocido"
    
    return Response.json(
      { 
        error: "Error al procesar la imagen", 
        details: errorMessage,
        hint: "Asegúrate de que la API key de Google esté configurada correctamente"
      },
      { status: 500 }
    )
  }
}
