import dayjs from 'dayjs';

export default function getRelativeTime(date: Date) {
  const now = dayjs();
  const timestamp = dayjs(date);
  const secondsDiff = now.diff(timestamp, 'second');
  const minutesDiff = now.diff(timestamp, 'minute');
  const hoursDiff = now.diff(timestamp, 'hour');
  const daysDiff = now.diff(timestamp, 'day');
  const weeksDiff = now.diff(timestamp, 'week');
  const monthsDiff = now.diff(timestamp, 'month');
  const yearsDiff = now.diff(timestamp, 'year');

  // Handle future dates
  if (secondsDiff < 0) {
    return 'in the future';
  }

  // Less than a minute
  if (secondsDiff < 60) {
    return secondsDiff === 1 ? '1 second ago' : `${secondsDiff} seconds ago`;
  }

  // Less than an hour
  if (minutesDiff < 60) {
    return minutesDiff === 1 ? '1 minute ago' : `${minutesDiff} minutes ago`;
  }

  // Less than a day
  if (hoursDiff < 24) {
    return hoursDiff === 1 ? '1 hour ago' : `${hoursDiff} hours ago`;
  }

  // Less than a week
  if (daysDiff < 7) {
    return daysDiff === 1 ? '1 day ago' : `${daysDiff} days ago`;
  }

  // Less than a month
  if (weeksDiff < 4) {
    return weeksDiff === 1 ? '1 week ago' : `${weeksDiff} weeks ago`;
  }

  // Less than a year
  if (monthsDiff < 12) {
    return monthsDiff === 1 ? '1 month ago' : `${monthsDiff} months ago`;
  }

  // A year or more
  return yearsDiff === 1 ? '1 year ago' : `${yearsDiff} years ago`;
}
