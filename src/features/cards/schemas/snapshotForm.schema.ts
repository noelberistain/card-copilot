import { z } from "zod";

function parseMoney(value: string) {
  const normalized = value.replace(/,/g, "").trim();

  if (!normalized) return value;

  const num = Number(normalized);

  return Number.isNaN(num) ? value : num;
}

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const snapshotFormSchema = z
  .object({
    currentBalance: z
      .string()
      .transform(parseMoney)
      .pipe(
        z
          .number({
            message: "El saldo actual debe ser un número válido.",
          })
          .min(0, "El saldo actual no puede ser negativo.")
      ),

    statementBalance: z
      .string()
      .transform(parseMoney)
      .pipe(
        z
          .number({
            message: "El saldo al corte debe ser un número válido.",
          })
          .min(0, "El saldo al corte no puede ser negativo.")
      ),

    minimumPayment: z
      .string()
      .transform(parseMoney)
      .pipe(
        z
          .number({
            message: "El pago mínimo debe ser un número válido.",
          })
          .min(0, "El pago mínimo no puede ser negativo.")
      ),

    paymentToAvoidInterest: z
      .string()
      .transform(parseMoney)
      .pipe(
        z
          .number({
            message: "El pago para no generar intereses debe ser un número válido.",
          })
          .min(0, "El pago para no generar intereses no puede ser negativo.")
      ),

    lastCutoffDate: z
      .string()
      .trim()
      .regex(datePattern, "Usa formato YYYY-MM-DD."),

    paymentDueDate: z
      .string()
      .trim()
      .regex(datePattern, "Usa formato YYYY-MM-DD."),

    notes: z
      .string()
      .trim()
      .optional()
      .transform((value) => value || null),
  })
  .refine((values) => values.minimumPayment <= values.currentBalance, {
    message: "El pago mínimo no puede ser mayor al saldo actual.",
    path: ["minimumPayment"],
  })
  .refine((values) => values.paymentToAvoidInterest <= values.currentBalance, {
    message:
      "El pago para no generar intereses no puede ser mayor al saldo actual.",
    path: ["paymentToAvoidInterest"],
  })
  .refine((values) => values.paymentDueDate > values.lastCutoffDate, {
    message: "La fecha límite debe ser posterior al último corte.",
    path: ["paymentDueDate"],
  });

export type SnapshotFormInput = z.input<typeof snapshotFormSchema>;
export type SnapshotFormValues = z.output<typeof snapshotFormSchema>;
