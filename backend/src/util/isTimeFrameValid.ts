export default function isTimeFrameValid(timeframe: string) {
  return (
    timeframe === 'day' ||
    timeframe === 'week' ||
    timeframe === 'month' ||
    timeframe === 'year' ||
    timeframe === 'all'
  );
}
