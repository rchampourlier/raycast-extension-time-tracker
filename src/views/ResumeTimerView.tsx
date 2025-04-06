import { List, Icon, ActionPanel, Action } from "@raycast/api";
import type { Timer } from "../types";
import { formatElapsedTime } from "../utils/formatUtils";

export function ResumeTimerView({ activeTimer, handlePauseResume }: { activeTimer: Timer, handlePauseResume: () => Promise<void> }) {
  return (
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
    />)
}