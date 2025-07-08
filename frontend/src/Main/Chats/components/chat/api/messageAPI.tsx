import apiRequest from '@/util/apiRequest';
import catchError from '@/util/catchError';
import { toast } from 'react-toastify';

import { Pagination } from '@/interface/backendTypes';
import { DBMessage } from '@/interface/dbSchema';

// ! All calls are in messageController.ts

interface FetchChatMessages {
  message: string;
  messages: DBMessage[];
  pagination: Pagination;
}
export async function fetchChatMessages(
  token: string | null,
  chatId: string,
  cursorId: string,
  onComplete: (messages: DBMessage[], pagination: Pagination) => void,
) {
  try {
    const params = new URLSearchParams({
      chat_id: chatId,
      cId: cursorId,
    });

    const response = await apiRequest<FetchChatMessages>(
      `/chat/message?${params.toString()}`,
      'GET',
      token,
    );

    onComplete(response.messages, response.pagination);
  } catch (error) {
    catchError(error);
  }
}

interface SendChatMessageResponse {
  message: string;
  sentMessage: DBMessage;
}
export async function sendChatMessage(
  token: string | null,
  chat_id: string,
  content: string,
): Promise<DBMessage> {
  try {
    const response = await apiRequest<SendChatMessageResponse>(
      '/chat/message',
      'POST',
      token,
      {
        chat_id,
        content,
      },
    );

    return response.sentMessage;
  } catch (error) {
    const toastId1 = 'toastId1';
    const toastId2 = 'toastId2';
    const errorMessage = 'Failed to send message, please try again';

    if (toast.isActive(toastId1)) {
      toast.dismiss(toastId1);
      toast.error(errorMessage, { toastId: toastId2 });
    } else if (toast.isActive(toastId2)) {
      toast.dismiss(toastId2);
      toast.error(errorMessage, { toastId: toastId1 });
    } else {
      toast.error(errorMessage, { toastId: toastId1 });
    }
    throw error;
  }
}
