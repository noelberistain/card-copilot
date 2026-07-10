import { z } from "zod";

function parseNumber(value: string) {
  return Number(value.replace(/,/g, "").trim());
}

function isValidNumber(value: string) {
  if (!value.trim()) return false;

  const parsed = parseNumber(value);

  return Number.isFinite(parsed);
}

function isValidDay(value: string) {
  if (!value.trim()) return false;

  const parsed = Number(value.trim());

  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 31;
}

const optionalNetwork = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .transform((value) => value || null)
  .refine(
    (value) =>
      value === null ||
      value === "visa" ||
      value === "mastercard" ||
      value === "amex" ||
      value === "other",
    {
      message: "La red debe ser visa, mastercard, amex u other.",
    }
  );

const optionalColor = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || null)
  .refine((value) => value === null || /^#[0-9A-Fa-f]{6}$/.test(value), {
    message: "El color debe tener formato hexadecimal. Ej. #2563eb.",
  });

export const cardFormSchema = z.object({
  alias: z
    .string()
    .trim()
    .min(1, "El alias es obligatorio.")
    .max(60, "El alias no puede tener más de 60 caracteres."),

  bank: z
    .string()
    .trim()
    .min(1, "El banco es obligatorio.")
    .max(60, "El banco no puede tener más de 60 caracteres."),

  creditLimit: z
    .string()
    .trim()
    .min(1, "La línea de crédito es obligatoria.")
    .refine(isValidNumber, {
      message: "La línea de crédito debe ser un número válido.",
    })
    .transform(parseNumber)
    .refine((value) => value > 0, {
      message: "La línea de crédito debe ser mayor a 0.",
    }),

  cutoffDay: z
    .string()
    .trim()
    .min(1, "El día de corte es obligatorio.")
    .refine(isValidDay, {
      message: "El día de corte debe ser un número entre 1 y 31.",
    })
    .transform((value) => Number(value.trim())),

  paymentDueDay: z
    .string()
    .trim()
    .min(1, "El día de pago es obligatorio.")
    .refine(isValidDay, {
      message: "El día de pago debe ser un número entre 1 y 31.",
    })
    .transform((value) => Number(value.trim())),

  network: optionalNetwork,

  color: optionalColor,
});

export type CardFormInput = z.input<typeof cardFormSchema>;
export type CardFormValues = z.output<typeof cardFormSchema>;
