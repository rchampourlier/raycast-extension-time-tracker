import { List, ActionPanel, Action, Icon, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { getSessions, startTimer, exportSessionsToCSV } from "../utils/timerUtils";
import { formatDuration } from "../utils/formatUtils";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { environment } from "@raycast/api";
import type { Session } from "../types";

export function ListSessionsView() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const allSessions = await getSessions();
      setSessions(allSessions);
      setIsLoading(false);
    }
    loadSessions();
  }, []);

  async function handleExport() {
    try {
      const csvContent = await exportSessionsToCSV();
      const filename = `swan-timer-export-${new Date().toISOString().split('T')[0]}.csv`;
      const filePath = join(environment.supportPath, filename);

      await writeFile(filePath, csvContent);
      showToast(Toast.Style.Success, `Sessions exported to ${filePath}`);
    } catch (error) {
      showToast(Toast.Style.Failure, "Failed to export sessions");
    }
  }

  return (
    <List
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action
            title="Export to CSV"
            icon={Icon.Download}
            onAction={handleExport}
          />
        </ActionPanel>
      }
    >
      {sessions.map((session) => (
        <List.Item
          key={`${session.taskName}-${session.startTime}`}
          icon={Icon.Clock}
          title={session.taskName}
          subtitle={`Duration: ${formatDuration(session.duration)}`}
          accessories={[
            { text: new Date(session.startTime).toLocaleString() }
          ]}
          actions={
            <ActionPanel>
              <Action
                title="Restart Timer"
                icon={Icon.Repeat}
                onAction={async () => {
                  await startTimer(session.taskName);
                  showToast(Toast.Style.Success, `Started timer for "${session.taskName}"`);
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
} 