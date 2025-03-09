import { TimeFrame } from '@/Main/Community/Community';

export default function getTimeframeText(timeframe: TimeFrame) {
  if (timeframe === 'day') {
    return 'Today';
  } else if (timeframe === 'week') {
    return 'This Week';
  } else if (timeframe === 'month') {
    return 'This Month';
  } else if (timeframe === 'year') {
    return 'This Year';
  } else if (timeframe === 'all') {
    return 'All Time';
  }

  return 'Unknown';
}
