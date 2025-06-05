import { Link } from 'react-router-dom';
import { MessageCircleIcon } from 'lucide-react';

export default function ChatButton() {
  return (
    <Link to="/chats">
      <button className="h-10 w-10 rounded-full df bg-hover-transition hover:bg-accent-gray">
        <MessageCircleIcon className="h-6 w-6" />
      </button>
    </Link>
  );
}
