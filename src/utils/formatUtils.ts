import type { Timer } from "../types";

export function formatDuration(duration: number): string {
  const date = new Date(duration);
  return date.toISOString().substr(11, 8);
}

export function formatElapsedTime(timer: Timer): string {
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