import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { stopTimerWithAdjustedPausedTime } from "../utils/timerUtils";

interface FormValues {
  additionalPausedMinutes: string;
}

export default function AdjustPausedTimeView() {
  const [additionalPausedMinutes, setAdditionalPausedMinutes] = useState<string>("0");

  async function handleSubmit(values: FormValues) {
    const minutes = Number.parseFloat(values.additionalPausedMinutes);
    if (Number.isNaN(minutes) || minutes < 0) {
      showToast(Toast.Style.Failure, "Please enter a valid positive number");
      return;
    }

    const result = await stopTimerWithAdjustedPausedTime(minutes * 60 * 1000); // Convert minutes to milliseconds
    if (result.success) {
      showToast(Toast.Style.Success, `Timer stopped for "${result.taskName}" with ${minutes} minutes of additional paused time`);
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
      <Form.TextField
        id="additionalPausedMinutes"
        title="Additional Paused Time (minutes)"
        placeholder="Enter minutes of additional paused time"
        value={additionalPausedMinutes}
        onChange={setAdditionalPausedMinutes}
      />
    </Form>
  );
} 