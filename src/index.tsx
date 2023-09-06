import { useEffect } from "react";
import { Icon, MenuBarExtra, environment, LaunchType, getPreferenceValues } from "@raycast/api";
import { useCachedState } from "@raycast/utils";

interface Preferences {
  goal: string;
}

function formatTime(seconds: number, goalNumber: number): string {
  const totalSeconds = goalNumber;
  const remainingSeconds = totalSeconds - seconds;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsInMinute = remainingSeconds % 60;

  const percentagePassed = ((seconds / totalSeconds) * 100).toFixed(0);
  const secondsFormatted = (seconds: number) => {
    if (seconds === 0) {
      return "";
    }
    if (seconds === 1) {
      return `1 sec`;
    }

    return `${seconds} secs `;
  };

  return `${percentagePassed}% - ${minutes} ${minutes === 1 ? "min" : "mins"} ${secondsFormatted(
    remainingSecondsInMinute
  )}left`;
}

const useTimer = () => {
  const [seconds, setSeconds] = useCachedState<number>("timerSeconds", 0);
  const [isActive, setIsActive] = useCachedState<boolean>("timerActive", false);

  const toggle = (): void => {
    return setIsActive(!isActive);
  };
  const reset = (): void => {
    setSeconds(0);
    setIsActive(false);
  };

  useEffect(() => {
    if (environment.launchType === LaunchType.Background && isActive) {
      setSeconds((prevSeconds) => prevSeconds + 10);
    }
  }, [environment.launchType, isActive]);

  return { toggle, reset, seconds, isActive };
};

export default function Command() {
  const { goal } = getPreferenceValues<Preferences>();
  const goalNumber = parseInt(goal);
  const { toggle, reset, seconds, isActive } = useTimer();
  const [today, setToday] = useCachedState<string>("today");
  const currentDate = new Date().toLocaleDateString("en-US", { timeZone: "Europe/London" });
  const timeFormatted = formatTime(seconds, goalNumber);

  if (!today) {
    setToday(new Date().toLocaleDateString("en-US", { timeZone: "Europe/London" }));
  }

  useEffect(() => {
    if (today !== currentDate) {
      setToday(new Date().toLocaleDateString("en-US", { timeZone: "Europe/London" }));
      reset();
    }
  }, []);

  let content = {
    icon: isActive ? Icon.ArrowUp : Icon.ArrowDown,
    title: timeFormatted,
  };

  if (seconds >= 3600) {
    content = { icon: Icon.Check, title: "" };
  }

  return (
    <MenuBarExtra {...content}>
      <MenuBarExtra.Item title={isActive ? "Stop timer" : "Start timer"} onAction={() => toggle()} />
      <MenuBarExtra.Item title="Reset timer" onAction={() => reset()} />
    </MenuBarExtra>
  );
}
