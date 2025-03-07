import dayjs from 'dayjs';

export default function formatDate(date: string | Date) {
  return dayjs(date).format('MMM D, YYYY');
}
