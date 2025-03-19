import { TimeFrame } from '@/db/managers/util/types';

export default function getStartDate(timeframe: TimeFrame) {
  const now = new Date();

  // Calculate the start date based on the timeframe
  const startDate = new Date(now);

  switch (timeframe) {
    case 'day':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case 'all':
      return null;
    default:
      return null;
  }

  return startDate;
}
