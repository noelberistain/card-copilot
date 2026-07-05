export interface CardColorOption {
  label: string;
  value: string;
  tailwindName: string;
}

export const CARD_COLOR_OPTIONS: CardColorOption[] = [
  { label: "Azul", value: "#2563eb", tailwindName: "blue-600" },
  { label: "Morado", value: "#7c3aed", tailwindName: "violet-600" },
  { label: "Rosa", value: "#db2777", tailwindName: "pink-600" },
  { label: "Rojo", value: "#dc2626", tailwindName: "red-600" },
  { label: "Naranja", value: "#ea580c", tailwindName: "orange-600" },
  { label: "Verde", value: "#16a34a", tailwindName: "green-600" },
  { label: "Negro", value: "#0f172a", tailwindName: "slate-900" },
  { label: "Gris", value: "#64748b", tailwindName: "slate-500" },
  { label: "Gold", value: "#f59e0b", tailwindName: "yellow-500" },
];
