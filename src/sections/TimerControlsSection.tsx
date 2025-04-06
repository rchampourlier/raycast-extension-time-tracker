import { List } from "@raycast/api";
import type { Timer } from "../types"
import { StartTimerView } from "../views/StartTimerView";
import { StopTimerView } from "../views/StopTimerView";
import { ResumeTimerView } from "../views/ResumeTimerView";

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
        <StartTimerView />
      ) : (
        <>
          <StopTimerView activeTimer={activeTimer} setActiveTimer={setActiveTimer} />
          <ResumeTimerView activeTimer={activeTimer} handlePauseResume={handlePauseResume} />
        </>
      )}
    </List.Section>
  );
} 