import { differenceInCalendarDays, format, parseISO } from "date-fns";

export type PaymentTimingStatus = "overdue" | "due-today" | "urgent" | "soon" | "ok";

export function getTodayIsoDate() {
  return format(new Date(), "yyyy-MM-dd");
}

export function getDaysBetweenDates(fromIsoDate: string, toIsoDate: string) {
  return differenceInCalendarDays(parseISO(toIsoDate), parseISO(fromIsoDate));
}

export function getDaysUntilPayment(todayIso: string, paymentDueDate: string) {
  return getDaysBetweenDates(todayIso, paymentDueDate);
}

export function isPaymentOverdue(daysUntilPayment: number) {
  return daysUntilPayment < 0;
}

export function isPaymentDueToday(daysUntilPayment: number) {
  return daysUntilPayment === 0;
}

export function isPaymentUrgent(daysUntilPayment: number) {
  return daysUntilPayment > 0 && daysUntilPayment <= 3;
}

export function isPaymentSoon(daysUntilPayment: number) {
  return daysUntilPayment > 3 && daysUntilPayment <= 7;
}

export function getPaymentTimingStatus(daysUntilPayment: number): PaymentTimingStatus {
  if (isPaymentOverdue(daysUntilPayment)) return "overdue";
  if (isPaymentDueToday(daysUntilPayment)) return "due-today";
  if (isPaymentUrgent(daysUntilPayment)) return "urgent";
  if (isPaymentSoon(daysUntilPayment)) return "soon";

  return "ok";
}
