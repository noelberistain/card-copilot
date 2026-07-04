import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format, isValid, parseISO } from "date-fns";

interface AppDateInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
}

function dateFromValue(value: string) {
  if (!value) return new Date();

  const parsed = parseISO(value);

  return isValid(parsed) ? parsed : new Date();
}

export function AppDateInput({
  label,
  value,
  onChangeText,
  error,
  placeholder = "YYYY-MM-DD",
  disabled = false,
}: AppDateInputProps) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedDate = useMemo(() => dateFromValue(value), [value]);

  function handleChange(event: DateTimePickerEvent, date?: Date) {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }

    if (event.type === "dismissed" || !date) {
      return;
    }

    onChangeText(format(date, "yyyy-MM-dd"));
  }

  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-medium text-slate-700">{label}</Text>

      <Pressable
        disabled={disabled}
        onPress={() => setShowPicker(true)}
        className={[
          "rounded-2xl border bg-white px-4 py-4",
          error ? "border-red-500" : "border-slate-300",
          disabled ? "opacity-60" : "",
        ].join(" ")}
      >
        <Text
          className={[
            "text-base",
            value ? "text-slate-900" : "text-slate-400",
          ].join(" ")}
        >
          {value || placeholder}
        </Text>
      </Pressable>

      {showPicker ? (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleChange}
        />
      ) : null}

      {Platform.OS === "ios" && showPicker ? (
        <Pressable
          onPress={() => setShowPicker(false)}
          className="self-start rounded-full bg-slate-200 px-4 py-2"
        >
          <Text className="text-sm font-semibold text-slate-700">Listo</Text>
        </Pressable>
      ) : null}

      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
    </View>
  );
}
