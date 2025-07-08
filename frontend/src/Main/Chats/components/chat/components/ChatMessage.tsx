import PFP from '@/components/PFP';
import formatTimeCompact from '@/util/formatTimeCompact';
import { DBMessage } from '@/interface/dbSchema';
import { ShieldIcon, CircleAlertIcon } from 'lucide-react';

interface ChatMessageProps {
  message: DBMessage;
  retryMessage: (message: DBMessage) => Promise<void>;
}

export default function ChatMessage({ message, retryMessage }: ChatMessageProps) {
  const isSystemMessage = message.user_id === 'system_id';

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {isSystemMessage ? (
        <ShieldIcon className="mt-[6px] h-[32px] w-[32px] self-start" />
      ) : (
        <PFP
          src={message.user.profile_picture_url}
          className="mt-[6px] !h-[32px] !w-[32px] self-start"
        />
      )}

      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-1">
          <div className="font-bold">
            {message.user.deleted_at
              ? '[deleted]'
              : isSystemMessage
                ? 'System Message'
                : message.user.username}
          </div>

          <div className="whitespace-nowrap text-gray-400">
            • {formatTimeCompact(message.time_created)}
          </div>

          {message.status === 'failed' && (
            <>
              <div className="text-gray-400">•</div>

              <button
                className="group flex cursor-pointer items-center gap-1"
                onClick={() => retryMessage(message)}
              >
                <CircleAlertIcon className="text-red-500" />

                <span className="text-red-500 group-hover:underline">Retry</span>
              </button>
            </>
          )}
        </div>

        <div className="whitespace-pre-wrap break-all pr-2 text-sm">
          {message.content}
        </div>
      </div>
    </div>
  );
}
