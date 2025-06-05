import { useMemo } from 'react';
import { DBMessage } from '@/interface/dbSchema';
import dayjs from 'dayjs';

export interface DateGroupItem {
  type: 'date';
  id: string;
  date: dayjs.Dayjs;
  label: string;
}

export interface MessageItem {
  type: 'message';
  id: string;
  message: DBMessage;
}

type VirtualizedItem = DateGroupItem | MessageItem;

function formatDateLabel(messageDate: dayjs.Dayjs, now: dayjs.Dayjs): string {
  const today = now.startOf('day');
  const yesterday = today.subtract(1, 'day');
  const msgDay = messageDate.startOf('day');

  if (msgDay.isSame(today)) {
    return 'Today';
  } else if (msgDay.isSame(yesterday)) {
    return 'Yesterday';
  } else {
    // Show year only if different from current year
    const format = msgDay.year() === now.year() ? 'MMMM D' : 'MMMM D, YYYY';
    return msgDay.format(format);
  }
}

/** Custom hook for grouping messages by date */
export default function useGroupMessages(messages: DBMessage[]): VirtualizedItem[] {
  return useMemo((): VirtualizedItem[] => {
    if (!messages.length) return [];

    const now = dayjs();
    const items: VirtualizedItem[] = [];
    let currentDate: dayjs.Dayjs | null = null;
    let currentDateMessages: MessageItem[] = [];

    // Group messages by date first
    const messageGroups: {
      date: dayjs.Dayjs;
      messages: MessageItem[];
      label: string;
    }[] = [];

    for (const message of messages) {
      const messageDate = dayjs(message.time_created);

      if (!currentDate || !messageDate.isSame(currentDate, 'day')) {
        // Save previous group if it exists
        if (currentDate && currentDateMessages.length > 0) {
          messageGroups.push({
            date: currentDate,
            messages: currentDateMessages,
            label: formatDateLabel(currentDate, now),
          });
        }

        currentDate = messageDate;
        currentDateMessages = [];
      }

      currentDateMessages.push({
        type: 'message',
        id: message.id,
        message,
      });
    }

    if (currentDate && currentDateMessages.length > 0) {
      messageGroups.push({
        date: currentDate,
        messages: currentDateMessages,
        label: formatDateLabel(currentDate, now),
      });
    }

    // Build the items arr with messages first, then date header for each group
    for (const group of messageGroups) {
      // Add all messages for this date first
      items.push(...group.messages);

      // Then add the date header (due to everything being inverted)
      items.push({
        type: 'date',
        id: `date-${group.date.format('YYYY-MM-DD')}`,
        date: group.date,
        label: group.label,
      });
    }

    return items;
  }, [messages]);
}
