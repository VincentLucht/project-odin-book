import { TimeFrame } from '@/db/managers/util/types';

export default function getStartDate(timeframe: TimeFrame) {
  const now = new Date();

  // Calculate the start date based on the timeframe
  let startDate: Date | null = null;
  switch (timeframe) {
    case 'day':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    case 'all':
      startDate = null;
      break;
    default:
      startDate = null;
      break;
  }

  return startDate;
}
