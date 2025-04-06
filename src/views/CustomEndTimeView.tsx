import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { stopTimerWithCustomEndTime } from "../utils/timerUtils";

interface FormValues {
  endTime: string;
}

export default function CustomEndTimeView() {
  const [endTime, setEndTime] = useState<string>(new Date().toISOString().slice(0, 16));

  async function handleSubmit(values: FormValues) {
    const selectedEndTime = new Date(values.endTime).getTime();
    const currentTime = Date.now();

    if (selectedEndTime > currentTime) {
      showToast(Toast.Style.Failure, "End time cannot be in the future");
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
        onChange={(date) => setEndTime(date?.toISOString().slice(0, 16) || "")}
      />
    </Form>
  );
} 