import { MenuBarExtra, Icon, LaunchType, environment, getPreferenceValues } from "@raycast/api";
import { useState, useEffect } from "react";
import { startTimer, pauseTimer, resumeTimer, resetTimer, isTimerPaused, getTimerState } from "./util";
import { formatTime } from "./formatTIme";

export default function Command() {
  const [seconds, setSeconds] = useState(getTimerState() || 0);
  const isActive = typeof getTimerState() !== "undefined" ? !isTimerPaused() : false;
  const { goal } = getPreferenceValues();
  const goalNumber = parseInt(goal);

  const toggle = (): void => {
    if (!isTimerPaused() && getTimerState() == null) {
      startTimer();
    } else if (isTimerPaused()) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const reset = (): void => {
    console.log("🚀 ~ file: index.tsx:25 ~ reset ~ reset:", reset);
    resetTimer();
  };

  useEffect(() => {
    if (environment.launchType === LaunchType.Background && isActive) {
      setSeconds(getTimerState() || 0);
    }
  }, [environment.launchType, isActive]);

  console.log("🚀 ~ file: index.tsx:29 ~ useEffect ~ getTimerState():", getTimerState());
  console.log("🚀 ~ file: index.tsx:28 ~ useEffect ~ environment.launchType:", environment.launchType);
  console.log("seconds", seconds);
  const timerContent = isActive
    ? { icon: Icon.ArrowUp, title: formatTime(seconds, goalNumber) }
    : { icon: Icon.ArrowDown, title: formatTime(seconds, goalNumber) };

  const timerComplete = seconds > goal;
  const completeContent = {
    icon: Icon.Check,
    title: "",
  };

  const content = timerComplete ? completeContent : timerContent;
  return (
    <MenuBarExtra {...content}>
      <MenuBarExtra.Item title={isActive ? "Pause Timer" : "Start Timer"} onAction={toggle} />
      <MenuBarExtra.Item title="Reset Timer" onAction={reset} />
    </MenuBarExtra>
  );
}
