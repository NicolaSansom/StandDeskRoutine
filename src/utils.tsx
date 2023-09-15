import { environment } from "@raycast/api";
import { existsSync, readFileSync, writeFileSync } from "fs";

interface Timer {
  date: string;
  startedAt: number | null;
  pausedAt: number | null;
  elapsed: number;
}

const TIMER_FILE_PATH = environment.supportPath + "/timer-standing-desk.json";

const currentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

const currentDate = (): string => {
  return new Date().toISOString().split("T")[0]; // returns YYYY-MM-DD format
};

const getTimersFromJsonFile = (): Timer[] => {
  let timersData = "[]";
  if (existsSync(TIMER_FILE_PATH)) {
    timersData = readFileSync(TIMER_FILE_PATH, "utf-8");
  }

  return JSON.parse(timersData);
};

const saveTimersToJsonFile = (timers: Timer[]) => {
  writeFileSync(TIMER_FILE_PATH, JSON.stringify(timers));
};

const startTimer = () => {
  const timers = getTimersFromJsonFile();
  const timer: Timer = {
    date: currentDate(),
    startedAt: currentTimestamp(),
    pausedAt: null,
    elapsed: 0,
  };

  timers.push(timer);

  saveTimersToJsonFile(timers);
};

const pauseTimer = () => {
  const timers = getTimersFromJsonFile();
  const timer = timers.find((t) => t.date === currentDate());

  if (timer?.startedAt) {
    timer.pausedAt = currentTimestamp();
    timer.elapsed += timer.pausedAt - timer.startedAt;
    timer.startedAt = null;

    saveTimersToJsonFile(timers);
  }
};

const resumeTimer = () => {
  const timers = getTimersFromJsonFile();
  const timer = timers.find((t) => t.date === currentDate());

  if (timer?.pausedAt) {
    timer.startedAt = currentTimestamp();
    timer.pausedAt = null;

    saveTimersToJsonFile(timers);
  }
};

const resetTimer = () => {
  const timers = getTimersFromJsonFile();
  const index = timers.findIndex((t) => t.date === currentDate());

  if (index >= 0) {
    timers.splice(index, 1);
  }

  saveTimersToJsonFile(timers);
};

const getTimerState = (): number | undefined => {
  const timers = getTimersFromJsonFile();
  const timer = timers.find((t) => t.date === currentDate());

  if (timer?.startedAt) {
    return currentTimestamp() - timer.startedAt + timer.elapsed;
  } else if (timer?.pausedAt) {
    return timer.elapsed;
  }

  return undefined;
};

export { startTimer, pauseTimer, resumeTimer, getTimerState, resetTimer };
