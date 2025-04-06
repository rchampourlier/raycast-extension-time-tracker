import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { ListSessionsView } from "../views/ListSessionsView";
import { ExportCSVView } from "../views/ExportCSVView";

export function MoreSection() {
  return (
    <List.Section title="More">
      <List.Item
        icon={Icon.List}
        title="View All Sessions"
        actions={
          <ActionPanel>
            <Action.Push
              title="View All Sessions"
              target={<ListSessionsView />}
              icon={Icon.List}
            />
          </ActionPanel>
        }
      />
      <List.Item
        icon={Icon.Download}
        title="Export to CSV"
        subtitle="Choose export location"
        actions={
          <ActionPanel>
            <Action.Push
              title="Export to CSV"
              target={<ExportCSVView />}
              icon={Icon.Download}
            />
          </ActionPanel>
        }
      />
    </List.Section>
  );
} 