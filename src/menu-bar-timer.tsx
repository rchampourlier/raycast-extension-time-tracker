import { MenuBarExtra, Icon, open } from "@raycast/api";
import { useState, useEffect } from "react";
import { getActiveTimer } from "./utils/timerUtils";

interface Timer {
  taskName: string;
  startTime: number;
  pausedAt?: number;
  totalPausedTime?: number;
}

export default function MenuBarTimer() {
  const [timer, setTimer] = useState<Timer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTimer() {
      const activeTimer = await getActiveTimer();
      setTimer(activeTimer);
      setIsLoading(false);
    }

    loadTimer();
  }, []);

  function formatElapsedTimeForMenubar(timer: Timer): string {
    const now = Date.now();
    let elapsed = now - timer.startTime;

    // Subtract total paused time if any
    if (timer.totalPausedTime) {
      elapsed -= timer.totalPausedTime;
    }

    // If currently paused, subtract current pause duration
    if (timer.pausedAt) {
      elapsed -= (now - timer.pausedAt);
    }

    const minutes = Math.floor(elapsed / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`;
    }
    return `${minutes}m`;
  }

  function truncateTaskName(name: string, length: number = 15): string {
    return name.length > length ? name.substring(0, length) + "..." : name;
  }

  if (!timer) {
    return <MenuBarExtra icon={Icon.Clock} title="No Timer" isLoading={isLoading} />;
  }

  const isPaused = timer.pausedAt !== undefined;
  const truncatedName = truncateTaskName(timer.taskName);
  const title = `${truncatedName} - ${formatElapsedTimeForMenubar(timer)}${isPaused ? " ⏸" : ""}`;

  return (
    <MenuBarExtra
      icon={Icon.Clock}
      title={title}
      isLoading={isLoading}
    >
      <MenuBarExtra.Item
        title={timer.taskName}
        icon={Icon.Clock}
      />
      <MenuBarExtra.Item
        title="Open Timer"
        icon={Icon.ArrowRight}
        onAction={() => open("raycast://extensions/rchampourlier/swan/timer")}
      />
    </MenuBarExtra>
  );
} 