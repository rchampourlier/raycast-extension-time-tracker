import { List, ActionPanel, Action, Icon } from "@raycast/api";
import type { Session, Timer } from "../types";
import { startTimer, getActiveTimer } from "../utils/timerUtils";
import { formatDuration } from "../utils/formatUtils";
import { SessionDetailsView } from "../views/SessionDetailsView";

interface RecentSessionsSectionProps {
  sessions: Session[];
  setActiveTimer: (timer: Timer | null) => void;
}

export function RecentSessionsSection({
  sessions,
  setActiveTimer
}: RecentSessionsSectionProps) {
  return (
    <List.Section title="Recent Sessions">
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
              <ActionPanel.Section>
                <Action
                  title="Restart Timer"
                  icon={Icon.Repeat}
                  onAction={async () => {
                    await startTimer(session.taskName);
                    const newTimer = await getActiveTimer();
                    setActiveTimer(newTimer);
                  }}
                />
              </ActionPanel.Section>
              <ActionPanel.Section>
                <Action.Push
                  title="Show Details"
                  icon={Icon.Info}
                  target={<SessionDetailsView session={session} />}
                  shortcut={{ modifiers: ["cmd"], key: "." }}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List.Section>
  );
} 