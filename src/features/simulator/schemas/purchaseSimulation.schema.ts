import { z } from "zod";

function parseMoney(value: string) {
  const normalized = value.replace(/,/g, "").trim();

  if (!normalized) return value;

  const num = Number(normalized);

  return Number.isNaN(num) ? value : num;
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const purchaseSimulationSchema = z.object({
  amount: z
    .string()
    .transform(parseMoney)
    .pipe(
      z
        .number({
          message: "El monto debe ser un número válido.",
        })
        .positive("El monto de la compra debe ser mayor a 0.")
    ),

  purchaseDate: z.string().trim().regex(datePattern, "Usa formato YYYY-MM-DD."),
});

export type PurchaseSimulationFormInput = z.input<typeof purchaseSimulationSchema>;

export type PurchaseSimulationFormValues = z.output<typeof purchaseSimulationSchema>;
