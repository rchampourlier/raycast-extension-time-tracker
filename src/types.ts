export interface Timer {
  taskName: string;
  startTime: number;
  pausedAt?: number;
  totalPausedTime?: number;
}

export interface Session {
  taskName: string;
  startTime: number;
  endTime: number;
  duration: number;
} 