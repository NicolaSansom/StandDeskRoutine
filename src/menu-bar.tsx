import { useEffect } from "react";
import { MenuBarExtra, Icon, getPreferenceValues, PreferenceValues } from "@raycast/api";
import useTimer from "./useTimer";
import { formatTime } from "./formatTIme";

const copy = (timerState: number | undefined, timerPaused: number | boolean) => {
  if (timerState === undefined) {
    return "Start Timer";
  }

  if (timerPaused) {
    return "Resume Timer";
  }

  return "Pause Timer";
};

export default function Command() {
  const {
    isLoading,
    timerState,
    refreshTimerState,
    handleStartTimer,
    handlePauseTimer,
    handleResumeTimer,
    handleResetTimer,
    getPauseState,
    handleGoalComplete,
  } = useTimer();
  const { goal } = getPreferenceValues<PreferenceValues>();
  const goalNumber = parseInt(goal);
  const timerPaused = typeof getPauseState() === "number";

  useEffect(() => {
    if (timerState && timerState > goal) {
      handleGoalComplete();
    }
  }, [timerState, goal]);

  if (isLoading) {
    refreshTimerState();
  }

  const toggle = (): void => {
    if (timerState === undefined) {
      handleStartTimer();
    } else {
      timerPaused ? handleResumeTimer() : handlePauseTimer();
    }
  };

  const reset = (): void => {
    handleResetTimer();
  };

  const timerContent =
    timerState && timerState > 0 && !timerPaused
      ? { icon: Icon.ArrowUp, title: formatTime(timerState, goalNumber) }
      : { icon: Icon.ArrowDown, title: formatTime(timerState || 0, goalNumber) };

  const timerComplete = timerState && timerState > goal;
  const completeContent = {
    icon: Icon.Check,
    title: "",
  };

  const content = timerComplete ? completeContent : timerContent;
  return (
    <MenuBarExtra {...content}>
      <MenuBarExtra.Item title={copy(timerState, timerPaused)} onAction={toggle} />
      <MenuBarExtra.Item title="Reset Timer" onAction={reset} />
    </MenuBarExtra>
  );
}
