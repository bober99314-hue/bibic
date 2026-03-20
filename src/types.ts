export type Tab = 'world' | 'alarm' | 'stopwatch' | 'timer';

export interface City {
  id: string;
  name: string;
  timezone: string;
}

export interface AlarmType {
  id: string;
  time: string; // HH:mm format
  enabled: boolean;
  days: number[]; // 0-6 (Sun-Sat)
  sound: boolean;
  vibrate: boolean;
  snooze: boolean;
  label: string;
}

export interface Lap {
  id: string;
  time: number;
  overallTime: number;
}
