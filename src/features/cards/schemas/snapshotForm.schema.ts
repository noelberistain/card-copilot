import { z } from "zod";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function normalizeString(value: string | undefined) {
  return value?.trim() ?? "";
}

function parseMoneyNumber(value: string | undefined) {
  const normalized = normalizeString(value).replace(/,/g, "");

  if (!normalized) return null;

  const num = Number(normalized);

  return Number.isFinite(num) ? num : null;
}

function parseOptionalMoneyNumber(value: string | undefined) {
  const normalized = normalizeString(value).replace(/,/g, "");

  if (!normalized) return null;

  const num = Number(normalized);

  return Number.isFinite(num) ? num : null;
}

function addIssue(ctx: z.RefinementCtx, path: string[], message: string) {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message,
    path,
  });
}

function isValidDateInput(value: string | undefined) {
  const normalized = normalizeString(value);

  return datePattern.test(normalized);
}

export const snapshotFormSchema = z
  .object({
    statementStatus: z.enum(["generated", "not-generated"]).default("generated"),

    currentBalance: z.string(),

    reportedAvailableCredit: z.string().optional(),

    statementBalance: z.string().optional(),
    minimumPayment: z.string().optional(),
    paymentToAvoidInterest: z.string().optional(),

    lastCutoffDate: z.string().optional(),
    nextCutoffDate: z.string().optional(),
    paymentDueDate: z.string().optional(),

    notes: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const currentBalance = parseMoneyNumber(values.currentBalance);

    if (currentBalance === null) {
      addIssue(ctx, ["currentBalance"], "El saldo actual debe ser un número válido.");
    } else if (currentBalance < 0) {
      addIssue(ctx, ["currentBalance"], "El saldo actual no puede ser negativo.");
    }

    const reportedAvailableCredit = parseOptionalMoneyNumber(
      values.reportedAvailableCredit
    );

    if (
      normalizeString(values.reportedAvailableCredit) &&
      reportedAvailableCredit === null
    ) {
      addIssue(
        ctx,
        ["reportedAvailableCredit"],
        "El crédito disponible reportado debe ser un número válido."
      );
    } else if (reportedAvailableCredit !== null && reportedAvailableCredit < 0) {
      addIssue(
        ctx,
        ["reportedAvailableCredit"],
        "El crédito disponible reportado no puede ser negativo."
      );
    }

    if (values.statementStatus === "not-generated") {
      if (!isValidDateInput(values.nextCutoffDate)) {
        addIssue(ctx, ["nextCutoffDate"], "Usa formato YYYY-MM-DD.");
      }

      return;
    }

    const statementBalance = parseMoneyNumber(values.statementBalance);
    const minimumPayment = parseMoneyNumber(values.minimumPayment);
    const paymentToAvoidInterest = parseMoneyNumber(values.paymentToAvoidInterest);

    if (statementBalance === null) {
      addIssue(ctx, ["statementBalance"], "El saldo al corte debe ser un número válido.");
    } else if (statementBalance < 0) {
      addIssue(ctx, ["statementBalance"], "El saldo al corte no puede ser negativo.");
    }

    if (minimumPayment === null) {
      addIssue(ctx, ["minimumPayment"], "El pago mínimo debe ser un número válido.");
    } else if (minimumPayment < 0) {
      addIssue(ctx, ["minimumPayment"], "El pago mínimo no puede ser negativo.");
    }

    if (paymentToAvoidInterest === null) {
      addIssue(
        ctx,
        ["paymentToAvoidInterest"],
        "El pago para no generar intereses debe ser un número válido."
      );
    } else if (paymentToAvoidInterest < 0) {
      addIssue(
        ctx,
        ["paymentToAvoidInterest"],
        "El pago para no generar intereses no puede ser negativo."
      );
    }

    if (
      currentBalance !== null &&
      minimumPayment !== null &&
      minimumPayment > currentBalance
    ) {
      addIssue(
        ctx,
        ["minimumPayment"],
        "El pago mínimo no puede ser mayor al saldo actual."
      );
    }

    if (
      currentBalance !== null &&
      paymentToAvoidInterest !== null &&
      paymentToAvoidInterest > currentBalance
    ) {
      addIssue(
        ctx,
        ["paymentToAvoidInterest"],
        "El pago para no generar intereses no puede ser mayor al saldo actual."
      );
    }

    if (!isValidDateInput(values.lastCutoffDate)) {
      addIssue(ctx, ["lastCutoffDate"], "Usa formato YYYY-MM-DD.");
    }

    if (!isValidDateInput(values.paymentDueDate)) {
      addIssue(ctx, ["paymentDueDate"], "Usa formato YYYY-MM-DD.");
    }

    const lastCutoffDate = normalizeString(values.lastCutoffDate);
    const paymentDueDate = normalizeString(values.paymentDueDate);

    if (
      datePattern.test(lastCutoffDate) &&
      datePattern.test(paymentDueDate) &&
      paymentDueDate <= lastCutoffDate
    ) {
      addIssue(
        ctx,
        ["paymentDueDate"],
        "La fecha límite debe ser posterior al último corte."
      );
    }
  })
  .transform((values) => {
    const statementStatus = values.statementStatus;

    return {
      statementStatus,

      currentBalance: parseMoneyNumber(values.currentBalance) ?? 0,

      reportedAvailableCredit: parseOptionalMoneyNumber(values.reportedAvailableCredit),

      statementBalance:
        statementStatus === "generated"
          ? (parseMoneyNumber(values.statementBalance) ?? 0)
          : 0,

      minimumPayment:
        statementStatus === "generated"
          ? (parseMoneyNumber(values.minimumPayment) ?? 0)
          : 0,

      paymentToAvoidInterest:
        statementStatus === "generated"
          ? (parseMoneyNumber(values.paymentToAvoidInterest) ?? 0)
          : 0,

      lastCutoffDate:
        statementStatus === "generated" ? normalizeString(values.lastCutoffDate) : "",

      nextCutoffDate:
        statementStatus === "not-generated"
          ? normalizeString(values.nextCutoffDate)
          : null,

      paymentDueDate:
        statementStatus === "generated" ? normalizeString(values.paymentDueDate) : "",

      notes: normalizeString(values.notes) || null,
    };
  });

export type SnapshotFormInput = z.input<typeof snapshotFormSchema>;
export type SnapshotFormValues = z.output<typeof snapshotFormSchema>;
