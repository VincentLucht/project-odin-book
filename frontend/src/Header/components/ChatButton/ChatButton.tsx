import { useState, useEffect } from 'react';
import useAuth from '@/context/auth/hook/useAuth';

import { getUnreadChatMessages } from '@/Main/Chats/api/chatAPI';

import { Link } from 'react-router-dom';
import { MessageCircleIcon } from 'lucide-react';

export default function ChatButton() {
  const [hasNewChatMessages, setHasNewChatMessages] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user) {
      void getUnreadChatMessages(token, (hasNewChatMessages) =>
        setHasNewChatMessages(hasNewChatMessages),
      );
    }
  }, [user, token]);

  return (
    <Link to="/chats" className="flex-shrink-0">
      <button className="relative h-10 w-10 rounded-full df bg-hover-transition hover:bg-accent-gray">
        <MessageCircleIcon className="h-6 w-6" />

        {hasNewChatMessages && (
          <div className="!left-[22px] !top-[5px] !h-[12px] !w-[12px] rounded bg-red-500 absolute-circle"></div>
        )}
      </button>
    </Link>
  );
}
