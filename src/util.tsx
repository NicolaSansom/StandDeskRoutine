import { Cache } from "@raycast/api";

const TIMER_CACHE_KEY = "timer";
const cache = new Cache();

type Timer = {
  startedAt: number | null;
  pausedAt: number | null;
  elapsed: number;
};

const currentTimestamp = (): number => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Starts the timer and stores the timer object in cache.
 */
const startTimer = () => {
  const timer: Timer = {
    startedAt: currentTimestamp(),
    pausedAt: null,
    elapsed: 0,
  };

  setTimerInCache(timer);
};

/**
 * Pauses the timer and updates the timer object in cache.
 */
const pauseTimer = () => {
  const timer: Timer = getTimerFromCache();

  if (timer?.startedAt) {
    timer.pausedAt = currentTimestamp();
    timer.elapsed += timer.pausedAt - timer.startedAt;
    timer.startedAt = null;

    setTimerInCache(timer);
  }
};

/**
 * Resumes the timer and updates the timer object in cache.
 */
const resumeTimer = () => {
  const timer: Timer = getTimerFromCache();

  if (timer?.pausedAt) {
    timer.startedAt = currentTimestamp();
    timer.pausedAt = null;

    setTimerInCache(timer);
  }
};

/**
 * Resets the timer by removing the timer object from cache.
 */
const resetTimer = () => {
  cache.remove(TIMER_CACHE_KEY);
};

/**
 * Checks if the timer is paused.
 * @returns {boolean} - True if the timer is paused, false otherwise.
 */
const isTimerPaused = (): boolean => {
  const timer: Timer = getTimerFromCache();
  return timer.pausedAt != null;
};

/**
 * Gets the current state of the timer.
 * @returns {number | undefined} - The elapsed time in seconds if the timer is started or paused, undefined otherwise.
 */
const getTimerState = (): number | undefined => {
  const timer: Timer = getTimerFromCache();

  if (timer?.startedAt) {
    const elapsed = currentTimestamp() - timer.startedAt + timer.elapsed;
    return elapsed;
  } else if (timer?.elapsed) {
    return timer.elapsed;
  }

  return undefined;
};

/**
 * Retrieves the timer object from the cache.
 * @returns {Timer} - The timer object.
 */
const getTimerFromCache = (): Timer => {
  const timerData = cache.get(TIMER_CACHE_KEY) || "{}";
  return JSON.parse(timerData);
};

/**
 * Sets the timer object in the cache.
 * @param {Timer} timer - The timer object to be stored in the cache.
 */
const setTimerInCache = (timer: Timer) => {
  cache.set(TIMER_CACHE_KEY, JSON.stringify(timer));
};

export { startTimer, getTimerState, pauseTimer, resumeTimer, resetTimer, isTimerPaused };
