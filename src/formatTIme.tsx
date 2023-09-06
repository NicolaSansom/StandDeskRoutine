export function formatTime(seconds: number, goalNumber: number): string {
  const remainingSeconds = goalNumber - seconds;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsInMinute = remainingSeconds % 60;

  const percentagePassed = ((seconds / goalNumber) * 100).toFixed(0);
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
  )} left`;
}
