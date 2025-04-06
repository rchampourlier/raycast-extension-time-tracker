import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { StartTimerFormView } from "./StartTimerFormView";

export function StartTimerView() {
  return (
    <List.Item
      icon={Icon.Play}
      title="Start New Timer"
      actions={
        <ActionPanel>
          <Action.Push
            title="Start Timer"
            target={<StartTimerFormView />}
            icon={Icon.Play}
          />
        </ActionPanel>
      }
    />
  );
}
