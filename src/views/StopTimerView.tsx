import { List, Icon, ActionPanel, Action, showToast, Toast } from "@raycast/api";
import { formatElapsedTime } from "../utils/formatUtils";
import { stopTimer } from "../utils/timerUtils";
import AdjustPausedTimeView from "./AdjustPausedTimeView";
import CustomEndTimeView from "./CustomEndTimeView";
import type { Timer } from "../types";

export function StopTimerView({ activeTimer, setActiveTimer }: { activeTimer: Timer, setActiveTimer: (timer: Timer | null) => void }) {
  return (
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
          <Action.Push
            title="Stop with Custom End Time"
            target={<CustomEndTimeView />}
            icon={Icon.Clock}
            shortcut={{ modifiers: ["cmd"], key: "t" }}
          />
          <Action.Push
            title="Stop with Adjusted Paused Time"
            target={<AdjustPausedTimeView />}
            icon={Icon.Pause}
            shortcut={{ modifiers: ["cmd"], key: "p" }}
          />
        </ActionPanel>
      }
    />
  )
}