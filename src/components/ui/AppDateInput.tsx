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
  const [draftDate, setDraftDate] = useState(selectedDate);

  function openPicker() {
    setDraftDate(selectedDate);
    setShowPicker(true);
  }

  function handleChange(event: DateTimePickerEvent, date?: Date) {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (!date) return;

    if (Platform.OS === "android") {
      onChangeText(format(date, "yyyy-MM-dd"));
      setShowPicker(false);
      return;
    }

    setDraftDate(date);
  }

  function confirmIosDate() {
    onChangeText(format(draftDate, "yyyy-MM-dd"));
    setShowPicker(false);
  }

  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-medium text-slate-700">{label}</Text>

      <Pressable
        disabled={disabled}
        onPress={openPicker}
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
        <View className="rounded-2xl bg-white p-3">
          <DateTimePicker
            value={draftDate}
            mode="date"
            display={Platform.OS === "ios" ? "compact" : "default"}
            onChange={handleChange}
          />

          {Platform.OS === "ios" ? (
            <View className="mt-3 flex-row gap-3">
              <Pressable
                onPress={() => setShowPicker(false)}
                className="rounded-full bg-slate-200 px-4 py-2"
              >
                <Text className="text-sm font-semibold text-slate-700">
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmIosDate}
                className="rounded-full bg-blue-600 px-4 py-2"
              >
                <Text className="text-sm font-semibold text-white">Listo</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}

      {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
    </View>
  );
}
