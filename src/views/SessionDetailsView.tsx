import { Detail } from "@raycast/api";
import type { Session } from "../types";

interface SessionDetailsViewProps {
  session: Session;
}

export function SessionDetailsView({ session }: SessionDetailsViewProps) {
  const markdown = `
# Details

- Task Name: \`${session.taskName}\`
- Duration (ms): \`${session.duration}\`
- Start Time (UTC): \`${new Date(session.startTime).toISOString()}\`
- End Time (UTC): \`${new Date(session.endTime).toISOString()}\`
`;

  return <Detail markdown={markdown} />;
} 