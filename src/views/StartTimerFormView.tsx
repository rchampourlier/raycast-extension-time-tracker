import { useNavigation, showToast, Toast, Form, ActionPanel, Action } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { useState } from "react";
import { startTimer } from "../utils/timerUtils";

export function StartTimerFormView() {
  const [taskName, setTaskName] = useState("");
  const { pop } = useNavigation();

  const { handleSubmit } = useForm<{ taskName: string }>({
    onSubmit(_values) {
      try {
        startTimer(taskName.trim());
        showToast(Toast.Style.Success, "Timer started");
        pop();
      } catch (error) {
        showToast(Toast.Style.Failure, String(error));
      }
    },
    validation: {
      taskName: FormValidation.Required,
    },
  });

  return (
    <>
      <Form
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Start Timer" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="taskName"
          title="Task Name"
          placeholder="Enter task name"
          value={taskName}
          onChange={setTaskName}
          autoFocus
        />
      </Form >
    </>
  );
}