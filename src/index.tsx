import { MenuBarExtra, Icon, getPreferenceValues, PreferenceValues } from "@raycast/api";
import useTimer from "./useTimer";
import { formatTime } from "./formatTIme";

export default function Command() {
  const {
    isLoading,
    timerState,
    refreshTimerState,
    handleStartTimer,
    handlePauseTimer,
    handleResumeTimer,
    handleResetTimer,
  } = useTimer();
  const { goal } = getPreferenceValues<PreferenceValues>();
  const goalNumber = parseInt(goal);

  if (isLoading) {
    refreshTimerState();
  }

  const toggle = (): void => {
    if (timerState === undefined) {
      handleStartTimer();
    } else {
      timerState === 0 ? handleResumeTimer() : handlePauseTimer();
    }
  };

  const reset = (): void => {
    handleResetTimer();
  };

  const timerContent =
    timerState && timerState > 0
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
      <MenuBarExtra.Item title={timerState && timerState > 0 ? "Pause Timer" : "Start Timer"} onAction={toggle} />
      <MenuBarExtra.Item title="Reset Timer" onAction={reset} />
    </MenuBarExtra>
  );
}
