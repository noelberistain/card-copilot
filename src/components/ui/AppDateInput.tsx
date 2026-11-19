import DateTimePicker from "@react-native-community/datetimepicker";
import { format, isValid, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";

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
      <Text className="font-sans-medium text-sm text-ink">
        {label}
        {required ? <Text className="text-danger"> *</Text> : null}
        {!required && optional ? <Text className="text-ink-muted"> opcional</Text> : null}
      </Text>

      <Pressable
        className={[
          "rounded-2xl border bg-surface-muted px-4 py-4",
          error ? "border-danger" : "border-ink-muted/30",
          disabled ? "opacity-60" : "",
        ].join(" ")}
        disabled={disabled}
        onPress={openPicker}
      >
        <Text
          className={[
            "font-display text-base tabular-nums",
            value ? "text-ink" : "text-ink-muted",
          ].join(" ")}
        >
          {value || placeholder}
        </Text>
      </Pressable>

      {Platform.OS === "android" && showPicker ? (
        <DateTimePicker
          display="default"
          mode="date"
          value={draftDate}
          onDismiss={handleDismiss}
          onValueChange={handleValueChange}
        />
      ) : null}

      {Platform.OS === "ios" ? (
        <Modal
          animationType="fade"
          transparent
          visible={showPicker}
          onRequestClose={handleDismiss}
        >
          <View className="flex-1 justify-end bg-black/30 px-4 pb-8">
            <View className="rounded-3xl bg-surface-muted p-5">
              <View className="mb-4 flex-row items-center justify-between">
                <Pressable
                  className="rounded-full bg-ink-muted/20 px-4 py-2"
                  onPress={handleDismiss}
                >
                  <Text className="font-sans-semibold text-sm text-ink">Cancelar</Text>
                </Pressable>

                <Pressable
                  className="rounded-full bg-primary px-4 py-2"
                  onPress={confirmIosDate}
                >
                  <Text className="font-sans-semibold text-sm text-white">Listo</Text>
                </Pressable>
              </View>

              <DateTimePicker
                display="spinner"
                mode="date"
                value={draftDate}
                onDismiss={handleDismiss}
                onValueChange={handleValueChange}
              />
            </View>
          </View>
        </Modal>
      ) : null}

      {error ? <Text className="text-sm text-danger">{error}</Text> : null}
    </View>
  );
}
