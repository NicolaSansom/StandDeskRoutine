import { Cache } from "@raycast/api";

const TIMER_CACHE_KEY = "timer";
const cache = new Cache();

let timer = null;

function currentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

function startTimer() {
  timer = { startedAt: currentTimestamp(), pausedAt: null, elapsed: 0 };

  cache.set(TIMER_CACHE_KEY, JSON.stringify(timer));
}

function pauseTimer() {
  const timer = JSON.parse(cache.get(TIMER_CACHE_KEY) || "{}");

  if (timer?.startedAt) {
    timer.pausedAt = currentTimestamp();
    timer.elapsed += timer.pausedAt - timer.startedAt;
    timer.startedAt = null;

    cache.set(TIMER_CACHE_KEY, JSON.stringify(timer));
  }
}

function resumeTimer() {
  const timer = JSON.parse(cache.get(TIMER_CACHE_KEY) || "{}");

  if (timer?.pausedAt) {
    timer.startedAt = currentTimestamp();
    timer.pausedAt = null;

    cache.set(TIMER_CACHE_KEY, JSON.stringify(timer));
  }
}

function resetTimer() {
  cache.remove(TIMER_CACHE_KEY);
}

function isTimerPaused(): boolean {
  const timer = JSON.parse(cache.get(TIMER_CACHE_KEY) || "{}");
  return timer.pausedAt != null;
}

function getTimerState(): number | undefined {
  const timer = JSON.parse(cache.get(TIMER_CACHE_KEY) || "{}");

  if (timer?.startedAt) {
    const elapsed = currentTimestamp() - timer.startedAt + timer.elapsed;
    return elapsed;
  } else if (timer?.elapsed) {
    return timer.elapsed;
  }
  return undefined;
}

export { startTimer, getTimerState, pauseTimer, resumeTimer, resetTimer, isTimerPaused };
