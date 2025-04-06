import { Form, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { useNavigation } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { exportSessionsToCSV } from "../utils/timerUtils";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

export function ExportCSVView() {
  const [location, setLocation] = useState(homedir());
  const { pop } = useNavigation();

  const { handleSubmit } = useForm<{ location: string }>({
    onSubmit(values) {
      try {
        const filePath = join(values.location, `swan-timer-export-${new Date().toISOString().split('T')[0]}.csv`);
        exportSessionsToCSV().then(async (csvContent) => {
          await writeFile(filePath, csvContent);
          showToast(Toast.Style.Success, `Sessions exported to ${filePath}`);
          pop();
        }).catch((error) => {
          showToast(Toast.Style.Failure, `Failed to export sessions: ${error}`);
        });
      } catch (error) {
        showToast(Toast.Style.Failure, `Failed to write file: ${error}`);
      }
    },
    validation: {
      location: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Export to CSV" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="location"
        title="Export Location"
        placeholder="Enter directory path"
        value={location}
        onChange={setLocation}
        autoFocus
      />
    </Form>
  );
} 