import { environment } from "@raycast/api";
import { existsSync, readFileSync, writeFileSync } from "fs";

interface Timer {
  startedAt: number | null;
  pausedAt: number | null;
  elapsed: number;
}

const TIMER_FILE_PATH = environment.supportPath + "/timer-standing-desk.json";

const currentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

const getTimerFromJsonFile = (): Timer => {
  let timerData = "{}";
  if (existsSync(TIMER_FILE_PATH)) {
    timerData = readFileSync(TIMER_FILE_PATH, "utf-8");
  }

  return JSON.parse(timerData);
};

const saveTimerToJsonFile = (timer: Timer) => {
  writeFileSync(TIMER_FILE_PATH, JSON.stringify(timer));
};

const startTimer = () => {
  const timer: Timer = {
    startedAt: currentTimestamp(),
    pausedAt: null,
    elapsed: 0,
  };

  saveTimerToJsonFile(timer);
};

const pauseTimer = () => {
  const timer = getTimerFromJsonFile();

  if (timer?.startedAt) {
    timer.pausedAt = currentTimestamp();
    timer.elapsed += timer.pausedAt - timer.startedAt;
    timer.startedAt = null;

    saveTimerToJsonFile(timer);
  }
};

const resumeTimer = () => {
  const timer = getTimerFromJsonFile();

  if (timer?.pausedAt) {
    timer.startedAt = currentTimestamp();
    timer.pausedAt = null;

    saveTimerToJsonFile(timer);
  }
};

const resetTimer = () => {
  if (existsSync(TIMER_FILE_PATH)) {
    saveTimerToJsonFile({
      startedAt: null,
      pausedAt: null,
      elapsed: 0,
    });
  }
};

const getTimerState = (): number | undefined => {
  const timer = getTimerFromJsonFile();

  if (timer?.startedAt) {
    return currentTimestamp() - timer.startedAt + timer.elapsed;
  } else if (timer?.pausedAt) {
    return timer.elapsed;
  }

  return undefined;
};

export { startTimer, pauseTimer, resumeTimer, getTimerState, resetTimer };
