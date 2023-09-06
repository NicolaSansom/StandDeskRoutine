import { Cache } from "@raycast/api";

const TIMER_CACHE_KEY = "timer";
const cache = new Cache();

let timer = null;

function currentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

function startTimer() {
  timer = {
    parts: [{ startedAt: currentTimestamp() }],
  };

  cache.set(TIMER_CACHE_KEY, JSON.stringify(timer));
}

function pauseTimer() {
  const timer = JSON.parse(cache.get(TIMER_CACHE_KEY) || "{}");

  if (timer?.parts) {
    timer.parts[timer.parts.length - 1].pausedAt = currentTimestamp();

    cache.set(TIMER_CACHE_KEY, JSON.stringify(timer));
  }
}

function resumeTimer() {
  const timer = JSON.parse(cache.get(TIMER_CACHE_KEY) || "{}");

  if (timer?.parts?.[timer.parts.length - 1].pausedAt) {
    timer.parts.push({ startedAt: currentTimestamp() });

    cache.set(TIMER_CACHE_KEY, JSON.stringify(timer));
  }
}

function resetTimer() {
  cache.remove(TIMER_CACHE_KEY);
}

function isTimerPaused(): boolean {
  const timer = JSON.parse(cache.get(TIMER_CACHE_KEY) || "{}");

  return timer.parts ? !!timer.parts[timer.parts.length - 1].pausedAt : false; // Or whatever default value you would like when the timer is not set
}

function getTimerState(): number | undefined {
  const timer = JSON.parse(cache.get(TIMER_CACHE_KEY) || "{}");

  if (timer && timer.parts) {
    const now = currentTimestamp();
    let totalActiveTime = 0;
    for (const part of timer.parts) {
      const end = part.pausedAt ?? now;
      totalActiveTime += end - part.startedAt;
    }
    return totalActiveTime;
  }
  return undefined;
}

export { startTimer, getTimerState, pauseTimer, resumeTimer, resetTimer, isTimerPaused };
