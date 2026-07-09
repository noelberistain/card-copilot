import { isSameDay, parseISO } from "date-fns";

export function isToday(dateIso: string) {
  return isSameDay(parseISO(dateIso), new Date());
}
