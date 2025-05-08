import dayjs from 'dayjs';

/** Format date in a compact format based on elapsed time */
export default function formatTimeCompact(date: string | Date) {
  const now = dayjs();
  const inputDate = dayjs(date);
  const diffSeconds = now.diff(inputDate, 'second');
  const diffMinutes = now.diff(inputDate, 'minute');
  const diffHours = now.diff(inputDate, 'hour');
  const diffDays = now.diff(inputDate, 'day');

  // minutes (including under 60 seconds case)
  if (diffMinutes < 60) {
    return diffSeconds < 60 ? '1m' : `${diffMinutes}m`;
  }

  // hours
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  // week
  if (diffDays < 7) {
    return `${diffDays}d`;
  }

  // Check if it's within current year
  if (inputDate.year() === now.year()) {
    // Same year (e.g., "Apr 22")
    return inputDate.format('MMM D');
  } else {
    // Different year (e.g., "23/12/2020")
    return inputDate.format('DD/MM/YYYY');
  }
}
