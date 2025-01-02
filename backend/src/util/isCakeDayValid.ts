import dayjs from 'dayjs';

export default function isCakeDayValid(cake_day: string) {
  if (cake_day) {
    const isCakeDayValid = dayjs(cake_day, 'DD/MM', true).isValid();
    if (!isCakeDayValid) {
      throw new Error('Cake Day must be in DD/MM format');
    }
  }
}
