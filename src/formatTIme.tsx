function formatValueWithUnit(value: number, unit: string): string {
  if (value === 1) {
    return `1${unit}`;
  }
  return `${value}${unit}`;
}

export function formatTime(seconds: number, goal: number): string {
  const remainingSeconds = goal - seconds;
  const minutes = Math.floor(remainingSeconds / 60);
  const percentagePassed = ((seconds / goal) * 100).toFixed(0);

  const minutesFormatted = formatValueWithUnit(minutes, "m");

  return `${percentagePassed}% - ${minutesFormatted} left`;
}

export function formatTotalTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const hoursFormatted = formatValueWithUnit(hours, "h");
  const minutesFormatted = formatValueWithUnit(minutes, "m");

  return `${hoursFormatted} ${minutesFormatted}`;
}
