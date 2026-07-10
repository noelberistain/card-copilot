import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export function formatShortDate(dateIso: string) {
  const date = parseISO(dateIso);

  if (!isValid(date)) {
    return "-";
  }

  return format(date, "d MMM", { locale: es });
}
