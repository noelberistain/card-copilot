import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isValid, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

interface AppDateInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  optional?: boolean;
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
  required = false,
  optional = false,
}: AppDateInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const selectedDate = useMemo(() => dateFromValue(value), [value]);
  const [draftDate, setDraftDate] = useState(selectedDate);

  function openPicker() {
    setDraftDate(selectedDate);
    setShowPicker(true);
  }

  function handleValueChange(_event: unknown, date?: Date) {
    if (!date) return;

    if (Platform.OS === "android") {
      onChangeText(format(date, "yyyy-MM-dd"));
      setShowPicker(false);
      return;
    }

    setDraftDate(date);
  }

  function handleDismiss() {
    setShowPicker(false);
  }

  function confirmIosDate() {
    onChangeText(format(draftDate, "yyyy-MM-dd"));
    setShowPicker(false);
  }

  return (
    <View className="w-full gap-2">
      <Text className="text-sm font-medium text-slate-700">
        {label}
        {required ? <Text className="text-red-600"> *</Text> : null}
        {!required && optional ? <Text className="text-slate-400"> opcional</Text> : null}
      </Text>

      <Pressable
        className={[
          "rounded-2xl border bg-white px-4 py-4",
          error ? "border-red-500" : "border-slate-300",
          disabled ? "opacity-60" : "",
        ].join(" ")}
        disabled={disabled}
        onPress={openPicker}
      >
        <Text
          className={["text-base", value ? "text-slate-900" : "text-slate-400"].join(" ")}
        >
          {value || placeholder}
        </Text>
      </Pressable>

      {showPicker ? (
        <View className="rounded-2xl bg-white p-3">
          <DateTimePicker
            display={Platform.OS === "ios" ? "compact" : "default"}
            mode="date"
            value={draftDate}
            onDismiss={handleDismiss}
            onValueChange={handleValueChange}
          />

          {Platform.OS === "ios" ? (
            <View className="mt-3 flex-row gap-3">
              <Pressable
                className="rounded-full bg-slate-200 px-4 py-2"
                onPress={handleDismiss}
              >
                <Text className="text-sm font-semibold text-slate-700">Cancelar</Text>
              </Pressable>

              <Pressable
                className="rounded-full bg-blue-600 px-4 py-2"
                onPress={confirmIosDate}
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
