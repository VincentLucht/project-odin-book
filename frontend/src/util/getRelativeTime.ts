import dayjs from 'dayjs';

export default function getRelativeTime(
  date: Date | string,
  useShortFormat = false,
  removeAgo = false,
): string {
  const now = dayjs();
  const timestamp = dayjs(date);
  const secondsDiff = now.diff(timestamp, 'second');
  const minutesDiff = now.diff(timestamp, 'minute');
  const hoursDiff = now.diff(timestamp, 'hour');
  const daysDiff = now.diff(timestamp, 'day');
  const weeksDiff = now.diff(timestamp, 'week');
  const monthsDiff = now.diff(timestamp, 'month');
  const yearsDiff = now.diff(timestamp, 'year');

  const formatResult = (timeString: string): string => {
    return removeAgo ? timeString.replace(' ago', '') : timeString;
  };

  // Less than a minute
  if (secondsDiff < 60) {
    if (useShortFormat) {
      return formatResult('1m ago');
    }
    return formatResult('1 minute ago');
  }

  // Less than an hour
  if (minutesDiff < 60) {
    if (useShortFormat) {
      return formatResult(`${minutesDiff}m ago`);
    }
    return formatResult(
      minutesDiff === 1 ? '1 minute ago' : `${minutesDiff} minutes ago`,
    );
  }

  // Less than a day
  if (hoursDiff < 24) {
    if (useShortFormat) {
      return formatResult(`${hoursDiff}h ago`);
    }
    return formatResult(hoursDiff === 1 ? '1 hour ago' : `${hoursDiff} hours ago`);
  }

  // Less than a week
  if (daysDiff < 7) {
    if (useShortFormat) {
      return formatResult(`${daysDiff}d ago`);
    }
    return formatResult(daysDiff === 1 ? '1 day ago' : `${daysDiff} days ago`);
  }

  // Less than a month
  if (weeksDiff < 4) {
    if (useShortFormat) {
      return formatResult(`${weeksDiff}w ago`);
    }
    return formatResult(weeksDiff === 1 ? '1 week ago' : `${weeksDiff} weeks ago`);
  }

  // Less than a year
  if (monthsDiff < 12) {
    if (useShortFormat) {
      // If month diff is 0, fallback to weeks
      if (monthsDiff === 0) {
        return formatResult(`${weeksDiff}w ago`);
      }
      return formatResult(`${monthsDiff}mo ago`);
    }
    return formatResult(monthsDiff === 1 ? '1 month ago' : `${monthsDiff} months ago`);
  }

  // A year or more
  if (useShortFormat) {
    return formatResult(`${yearsDiff}y ago`);
  }
  return formatResult(yearsDiff === 1 ? '1 year ago' : `${yearsDiff} years ago`);
}
