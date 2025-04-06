import { LocalStorage } from "@raycast/api";

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

export async function startTimer(taskName: string): Promise<void> {
  const timer: Timer = {
    taskName,
    startTime: Date.now(),
    totalPausedTime: 0
  };
  await LocalStorage.setItem("activeTimer", JSON.stringify(timer));
}

export async function stopTimer(): Promise<{ success: boolean; taskName?: string; message?: string }> {
  const timerStr = await LocalStorage.getItem<string>("activeTimer");
  if (!timerStr) {
    return { success: false, message: "No active timer found" };
  }

  const timer: Timer = JSON.parse(timerStr);
  const endTime = Date.now();
  let duration = endTime - timer.startTime;

  // Subtract total paused time if any
  if (timer.totalPausedTime) {
    duration -= timer.totalPausedTime;
  }

  // If timer was paused, add the final pause duration
  if (timer.pausedAt) {
    duration -= (endTime - timer.pausedAt);
  }

  const session: Session = {
    taskName: timer.taskName,
    startTime: timer.startTime,
    endTime,
    duration
  };

  const sessionsStr = await LocalStorage.getItem<string>("sessions");
  const sessions: Session[] = sessionsStr ? JSON.parse(sessionsStr) : [];
  sessions.unshift(session);
  await LocalStorage.setItem("sessions", JSON.stringify(sessions));
  await LocalStorage.removeItem("activeTimer");

  return { success: true, taskName: timer.taskName };
}

export async function pauseTimer(): Promise<{ success: boolean; message?: string }> {
  const timerStr = await LocalStorage.getItem<string>("activeTimer");
  if (!timerStr) {
    return { success: false, message: "No active timer found" };
  }

  const timer: Timer = JSON.parse(timerStr);
  if (timer.pausedAt) {
    return { success: false, message: "Timer is already paused" };
  }

  timer.pausedAt = Date.now();
  await LocalStorage.setItem("activeTimer", JSON.stringify(timer));
  return { success: true };
}

export async function resumeTimer(): Promise<{ success: boolean; message?: string }> {
  const timerStr = await LocalStorage.getItem<string>("activeTimer");
  if (!timerStr) {
    return { success: false, message: "No active timer found" };
  }

  const timer: Timer = JSON.parse(timerStr);
  if (!timer.pausedAt) {
    return { success: false, message: "Timer is not paused" };
  }

  // Calculate the pause duration and add it to totalPausedTime
  const pauseDuration = Date.now() - timer.pausedAt;
  timer.totalPausedTime = (timer.totalPausedTime || 0) + pauseDuration;
  timer.pausedAt = undefined;

  await LocalStorage.setItem("activeTimer", JSON.stringify(timer));
  return { success: true };
}

export async function getActiveTimer(): Promise<Timer | null> {
  const timerStr = await LocalStorage.getItem<string>("activeTimer");
  return timerStr ? JSON.parse(timerStr) : null;
}

export async function getSessions(): Promise<Session[]> {
  const sessionsStr = await LocalStorage.getItem<string>("sessions");
  return sessionsStr ? JSON.parse(sessionsStr) : [];
}

export async function exportSessionsToCSV(): Promise<string> {
  const sessions = await getSessions();

  // Create CSV header
  const csvHeader = "Task Name,Start Time,End Time,Duration (ms)\n";

  // Convert sessions to CSV rows
  const csvRows = sessions.map(session =>
    `"${session.taskName}",${new Date(session.startTime).toISOString()},${new Date(session.endTime).toISOString()},${session.duration}`
  ).join("\n");

  return csvHeader + csvRows;
}

export async function stopTimerWithCustomEndTime(endTime: number): Promise<{ success: boolean; taskName?: string; message?: string }> {
  const timerStr = await LocalStorage.getItem<string>("activeTimer");
  if (!timerStr) {
    return { success: false, message: "No active timer found" };
  }

  const timer: Timer = JSON.parse(timerStr);
  let duration = endTime - timer.startTime;

  // Subtract total paused time if any
  if (timer.totalPausedTime) {
    duration -= timer.totalPausedTime;
  }

  // If timer was paused, add the final pause duration
  if (timer.pausedAt) {
    duration -= (endTime - timer.pausedAt);
  }

  const session: Session = {
    taskName: timer.taskName,
    startTime: timer.startTime,
    endTime,
    duration
  };

  const sessionsStr = await LocalStorage.getItem<string>("sessions");
  const sessions: Session[] = sessionsStr ? JSON.parse(sessionsStr) : [];
  sessions.unshift(session);
  await LocalStorage.setItem("sessions", JSON.stringify(sessions));
  await LocalStorage.removeItem("activeTimer");

  return { success: true, taskName: timer.taskName };
}

export async function stopTimerWithAdjustedPausedTime(additionalPausedTime: number): Promise<{ success: boolean; taskName?: string; message?: string }> {
  const timerStr = await LocalStorage.getItem<string>("activeTimer");
  if (!timerStr) {
    return { success: false, message: "No active timer found" };
  }

  const timer: Timer = JSON.parse(timerStr);
  const endTime = Date.now();
  let duration = endTime - timer.startTime;

  // Add the additional paused time to the total paused time
  timer.totalPausedTime = (timer.totalPausedTime || 0) + additionalPausedTime;

  // Subtract total paused time
  if (timer.totalPausedTime) {
    duration -= timer.totalPausedTime;
  }

  // If timer was paused, add the final pause duration
  if (timer.pausedAt) {
    duration -= (endTime - timer.pausedAt);
  }

  const session: Session = {
    taskName: timer.taskName,
    startTime: timer.startTime,
    endTime,
    duration
  };

  const sessionsStr = await LocalStorage.getItem<string>("sessions");
  const sessions: Session[] = sessionsStr ? JSON.parse(sessionsStr) : [];
  sessions.unshift(session);
  await LocalStorage.setItem("sessions", JSON.stringify(sessions));
  await LocalStorage.removeItem("activeTimer");

  return { success: true, taskName: timer.taskName };
}
