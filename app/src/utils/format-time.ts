import { getTime, formatDistanceToNow, formatDistanceToNowStrict, format } from 'date-fns';

type InputValue = Date | string | number | null | undefined;

export const fDate = (date: InputValue, newFormat?: string) => {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
};

export const fDateTime = (date: InputValue, newFormat?: string) => {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
};

export const fTime = (date: InputValue, newFormat?: string) => {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
};

export const fTimestamp = (date: InputValue) => (date ? getTime(new Date(date)) : '');

export const fToNow = (date: InputValue) =>
  date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';

export const fToNowWithoutPast = (date: InputValue, customPastText: string) => {
  if (!date) return '';

  const targetDate = new Date(date);
  const now = new Date();

  if (targetDate < now) {
    return customPastText;
  }

  return formatDistanceToNow(targetDate, {
    addSuffix: true,
  });
};

export const fToNowStrict = (date: InputValue) =>
  date ? formatDistanceToNowStrict(new Date(date), { addSuffix: true }) : '';

/**
 * Formats the given number of seconds into a string representation of hours, minutes, and seconds.
 * @param seconds - The number of seconds to format.
 * @returns A string representation of hours, minutes, and seconds in the format "hh:mm:ss".
 */
export const fSeconds = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds} s`;
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${days} d ${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')} h`;
  }

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')} h`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} min`;
};

export const fMilliseconds = (ms: number, showMilliseconds = false): string => {
  // Calculate hours, minutes, seconds, and milliseconds
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10); // Get two decimal places

  if (showMilliseconds) {
    // Format as HH:mm:ss,SS
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(2, '0')}`;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
