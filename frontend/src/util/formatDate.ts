import dayjs from 'dayjs';

export default function formatDate(date: string | Date) {
  if (date && dayjs(date).isValid()) {
    return dayjs(date).format('MMM D, YYYY');
  }

  return '';
}
