import { addYears, format, isSameDay, isSameYear, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatHumanDate(dateIso: string) {
  const date = parseISO(dateIso);
  const today = new Date();

  if (isSameDay(date, today)) {
    return "hoy";
  }

  if (isSameYear(date, today)) {
    return format(date, "d 'de' MMMM", { locale: es });
  }

  if (isSameYear(date, addYears(today, 1))) {
    return format(date, "d 'de' MMMM 'del próximo año'", { locale: es });
  }

  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
}
