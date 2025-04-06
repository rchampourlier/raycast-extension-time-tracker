import { List, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { getActiveTimer, getSessions, pauseTimer, resumeTimer } from "./utils/timerUtils";
import { TimerControlsSection } from "./sections/TimerControlsSection";
import { RecentSessionsSection } from "./sections/RecentSessionsSection";
import { MoreSection } from "./sections/MoreSection";
import type { Timer, Session } from "./types";

export default function TimerApp() {
  const [activeTimer, setActiveTimer] = useState<Timer | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [timer, sessions] = await Promise.all([
        getActiveTimer(),
        getSessions()
      ]);
      setActiveTimer(timer);
      setRecentSessions(sessions.slice(0, 5)); // Get 5 most recent sessions
      setIsLoading(false);
    }
    loadData();

    // Refresh data every second when timer is running
    const interval = setInterval(loadData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePauseResume = async () => {
    if (!activeTimer) return;

    try {
      if (activeTimer.pausedAt) {
        const result = await resumeTimer();
        if (result.success) {
          showToast(Toast.Style.Success, "Timer resumed");
        } else {
          showToast(Toast.Style.Failure, result.message || "Failed to resume timer");
        }
      } else {
        const result = await pauseTimer();
        if (result.success) {
          showToast(Toast.Style.Success, "Timer paused");
        } else {
          showToast(Toast.Style.Failure, result.message || "Failed to pause timer");
        }
      }
    } catch (error) {
      showToast(Toast.Style.Failure, String(error));
    }
  };

  return (
    <List isLoading={isLoading}>
      <TimerControlsSection
        activeTimer={activeTimer}
        setActiveTimer={setActiveTimer}
        handlePauseResume={handlePauseResume}
      />

      <RecentSessionsSection
        sessions={recentSessions}
        setActiveTimer={setActiveTimer}
      />

      <MoreSection />
    </List>
  );
}