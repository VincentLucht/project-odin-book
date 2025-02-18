import dayjs from 'dayjs';

export default function getRelativeTime(date: Date, useShortFormat = false): string {
  const now = dayjs();
  const timestamp = dayjs(date);
  const secondsDiff = now.diff(timestamp, 'second');
  const minutesDiff = now.diff(timestamp, 'minute');
  const hoursDiff = now.diff(timestamp, 'hour');
  const daysDiff = now.diff(timestamp, 'day');
  const weeksDiff = now.diff(timestamp, 'week');
  const monthsDiff = now.diff(timestamp, 'month');
  const yearsDiff = now.diff(timestamp, 'year');

  // Less than a minute
  if (secondsDiff < 60) {
    if (useShortFormat) {
      return `${1}m ago`;
    }

    return '1 minute ago';
  }

  // Less than an hour
  if (minutesDiff < 60) {
    if (useShortFormat) {
      return `${minutesDiff}m ago`;
    }
    return minutesDiff === 1 ? '1 minute ago' : `${minutesDiff} minutes ago`;
  }

  // Less than a day
  if (hoursDiff < 24) {
    if (useShortFormat) {
      return `${hoursDiff}h ago`;
    }
    return hoursDiff === 1 ? '1 hour ago' : `${hoursDiff} hours ago`;
  }

  // Less than a week
  if (daysDiff < 7) {
    if (useShortFormat) {
      return `${daysDiff}d ago`;
    }
    return daysDiff === 1 ? '1 day ago' : `${daysDiff} days ago`;
  }

  // Less than a month
  if (weeksDiff < 4) {
    if (useShortFormat) {
      return `${weeksDiff}w ago`;
    }
    return weeksDiff === 1 ? '1 week ago' : `${weeksDiff} weeks ago`;
  }

  // Less than a year
  if (monthsDiff < 12) {
    if (useShortFormat) {
      return `${monthsDiff}mo ago`;
    }
    return monthsDiff === 1 ? '1 month ago' : `${monthsDiff} months ago`;
  }

  // A year or more
  if (useShortFormat) {
    return `${yearsDiff}y ago`;
  }
  return yearsDiff === 1 ? '1 year ago' : `${yearsDiff} years ago`;
}
