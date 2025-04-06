import { List, ActionPanel, Action, Icon, showToast, Toast } from "@raycast/api";
import type { Timer } from "../types"
import { stopTimer } from "../utils/timerUtils";
import { StartTimerView } from "../views/StartTimerView";
import { formatElapsedTime } from "../utils/formatUtils";

interface TimerControlsSectionProps {
  activeTimer: Timer | null;
  setActiveTimer: (timer: Timer | null) => void;
  handlePauseResume: () => Promise<void>;
}

export function TimerControlsSection({
  activeTimer,
  setActiveTimer,
  handlePauseResume
}: TimerControlsSectionProps) {
  return (
    <List.Section title="Timer Controls">
      {!activeTimer ? (
        <List.Item
          icon={Icon.Play}
          title="Start New Timer"
          actions={
            <ActionPanel>
              <Action.Push
                title="Start Timer"
                target={<StartTimerView />}
                icon={Icon.Play}
              />
            </ActionPanel>
          }
        />
      ) : (
        <>
          <List.Item
            icon={Icon.Stop}
            title="Stop Timer"
            subtitle={`${activeTimer.taskName} (${formatElapsedTime(activeTimer)})`}
            actions={
              <ActionPanel>
                <Action
                  title="Stop Timer"
                  icon={Icon.Stop}
                  onAction={async () => {
                    const result = await stopTimer();
                    if (result.success) {
                      showToast(Toast.Style.Success, `Stopped timer for "${result.taskName}"`);
                      setActiveTimer(null);
                    } else {
                      showToast(Toast.Style.Failure, result.message || "Failed to stop timer");
                    }
                  }}
                />
              </ActionPanel>
            }
          />
          <List.Item
            icon={activeTimer.pausedAt ? Icon.Play : Icon.Pause}
            title={activeTimer.pausedAt ? "Resume Timer" : "Pause Timer"}
            subtitle={`${activeTimer.taskName} (${formatElapsedTime(activeTimer)})`}
            actions={
              <ActionPanel>
                <Action
                  title={activeTimer.pausedAt ? "Resume Timer" : "Pause Timer"}
                  icon={activeTimer.pausedAt ? Icon.Play : Icon.Pause}
                  onAction={handlePauseResume}
                />
              </ActionPanel>
            }
          />
        </>
      )}
    </List.Section>
  );
} 