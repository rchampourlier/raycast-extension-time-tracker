import { List, ActionPanel, Action, Icon, showToast, Toast, Form, popToRoot } from "@raycast/api";
import { useState, useEffect } from "react";
import { getActiveTimer, stopTimer, getSessions, startTimer, pauseTimer, resumeTimer } from "./utils/timerUtils";

interface Timer {
  taskName: string;
  startTime: number;
  pausedAt?: number;
  totalPausedTime?: number;
}

interface Session {
  taskName: string;
  startTime: number;
  endTime: number;
  duration: number;
}

// Start Timer Form Component
function StartTimerView() {
  const [taskName, setTaskName] = useState("");

  async function handleSubmit() {
    if (!taskName.trim()) {
      showToast(Toast.Style.Failure, "Please enter a task name");
      return;
    }
    try {
      await startTimer(taskName.trim());
      showToast(Toast.Style.Success, "Timer started");
      await popToRoot();
    } catch (error) {
      showToast(Toast.Style.Failure, String(error));
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Start Timer" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="taskName"
        title="Task Name"
        placeholder="Enter task name"
        value={taskName}
        onChange={setTaskName}
        autoFocus
      />
    </Form>
  );
}

// Sessions List Component
function ListSessionsView() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      const allSessions = await getSessions();
      setSessions(allSessions);
      setIsLoading(false);
    }
    loadSessions();
  }, []);

  function formatDuration(duration: number): string {
    const date = new Date(duration);
    return date.toISOString().substr(11, 8);
  }

  return (
    <List isLoading={isLoading}>
      {sessions.map((session, index) => (
        <List.Item
          key={index}
          icon={Icon.Clock}
          title={session.taskName}
          subtitle={`Duration: ${formatDuration(session.duration)}`}
          accessories={[
            { text: new Date(session.startTime).toLocaleString() }
          ]}
          actions={
            <ActionPanel>
              <Action
                title="Restart Timer"
                icon={Icon.Repeat}
                onAction={async () => {
                  await startTimer(session.taskName);
                  showToast(Toast.Style.Success, `Started timer for "${session.taskName}"`);
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

export default function Timer() {
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

  function formatDuration(duration: number): string {
    const date = new Date(duration);
    return date.toISOString().substr(11, 8);
  }

  function formatElapsedTime(timer: Timer): string {
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

    return formatDuration(elapsed);
  }

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
      {/* Timer Controls Section */}
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

      {/* Recent Sessions Section */}
      <List.Section title="Recent Sessions">
        {recentSessions.map((session, index) => (
          <List.Item
            key={index}
            icon={Icon.Clock}
            title={session.taskName}
            subtitle={`Duration: ${formatDuration(session.duration)}`}
            accessories={[
              { text: new Date(session.startTime).toLocaleString() }
            ]}
            actions={
              <ActionPanel>
                <Action
                  title="Restart Timer"
                  icon={Icon.Repeat}
                  onAction={async () => {
                    await startTimer(session.taskName);
                    const newTimer = await getActiveTimer();
                    setActiveTimer(newTimer);
                  }}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>

      {/* All Sessions Link */}
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
      </List.Section>
    </List>
  );
} 