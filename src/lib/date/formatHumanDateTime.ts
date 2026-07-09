import { format, isSameDay, isSameYear, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatHumanDateTime(dateIso: string) {
  const date = parseISO(dateIso);
  const today = new Date();

  if (isSameDay(date, today)) {
    return `hoy a las ${format(date, "h:mm a", { locale: es })}`;
  }

  if (isSameYear(date, today)) {
    return format(date, "d 'de' MMMM, h:mm a", { locale: es });
  }

  return format(date, "d 'de' MMMM 'de' yyyy, h:mm a", { locale: es });
}
