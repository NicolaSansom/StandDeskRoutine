import { useState } from "react";
import { startTimer, pauseTimer, resumeTimer, getTimerState, resetTimer, getPauseState, goalComplete } from "./utils";

export default function useTimer() {
  const [timerState, setTimerState] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshTimerState = () => {
    const currentTimerState = getTimerState();
    setTimerState(currentTimerState);
    setIsLoading(false);
  };

  const handleGoalComplete = () => {
    goalComplete();
  };

  const handleStartTimer = () => {
    startTimer();
    refreshTimerState();
  };

  const handlePauseTimer = () => {
    pauseTimer();
    refreshTimerState();
  };

  const handleResetTimer = () => {
    resetTimer();
    refreshTimerState();
  };

  const handleResumeTimer = () => {
    resumeTimer();
    refreshTimerState();
  };

  return {
    getPauseState,
    timerState,
    isLoading,
    refreshTimerState,
    handleResetTimer,
    handleStartTimer,
    handlePauseTimer,
    handleResumeTimer,
    handleGoalComplete,
  };
}
