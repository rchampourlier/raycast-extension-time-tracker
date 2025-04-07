import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { stopTimerWithCustomEndTime, getActiveTimer } from "../utils/timerUtils";

interface FormValues {
  endTime: string;
}

/**
 * Formats a date to YYYY-MM-DD HH:mm in local time
 * We use sv-SE locale because it guarantees YYYY-MM-DD HH:mm format
 * regardless of system locale settings
 */
function formatLocalDateTime(date: Date): string {
  return date.toLocaleString("sv-SE").slice(0, 16);
}

export default function CustomEndTimeView() {
  // Initialize with current local time
  const now = new Date();
  const [endTime, setEndTime] = useState<string>(formatLocalDateTime(now));

  async function handleSubmit(values: FormValues) {
    // Convert the local time string to a Date object
    const localDate = new Date(values.endTime);

    // Get the timestamp in UTC
    const selectedEndTime = localDate.getTime();
    const currentTime = Date.now();

    if (selectedEndTime > currentTime) {
      showToast(Toast.Style.Failure, "End time cannot be in the future");
      return;
    }

    // Get active timer to check start time
    const activeTimer = await getActiveTimer();
    if (!activeTimer) {
      showToast(Toast.Style.Failure, "No active timer found");
      return;
    }

    if (selectedEndTime < activeTimer.startTime) {
      showToast(Toast.Style.Failure, "End time cannot be before the timer's start time");
      return;
    }

    const result = await stopTimerWithCustomEndTime(selectedEndTime);
    if (result.success) {
      showToast(Toast.Style.Success, `Timer stopped for "${result.taskName}"`);
    } else {
      showToast(Toast.Style.Failure, result.message || "Failed to stop timer");
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Stop Timer" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.DatePicker
        id="endTime"
        title="End Time"
        value={new Date(endTime)}
        onChange={(date) => {
          if (date) {
            setEndTime(formatLocalDateTime(date));
          }
        }}
      />
    </Form>
  );
} 