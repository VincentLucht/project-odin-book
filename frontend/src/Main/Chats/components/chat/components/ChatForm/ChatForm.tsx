import TextareaAutosize from 'react-textarea-autosize';
import { SendHorizontalIcon } from 'lucide-react';

interface ChatMessageFormProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  showChatSettings: boolean;
  sendMessage: () => void;
}

export default function ChatMessageForm({
  message,
  setMessage,
  showChatSettings,
  sendMessage,
}: ChatMessageFormProps) {
  return (
    <form
      className="relative flex min-h-[56px] gap-3 p-2 pr-4"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <div
        className="h-full w-full rounded-3xl py-[10px] df bg-accent-gray hover:cursor-text"
        onClick={() => document.getElementById('send-message-textarea')?.focus()}
      >
        <TextareaAutosize
          className="ml-4 mr-1 w-full pr-4 text-sm bg-accent-gray focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message-textarea"
          id="send-message-textarea"
          autoFocus
          autoComplete="off"
          placeholder="Message"
          style={{ resize: 'none', scrollPadding: '10px' }}
          maxRows={5}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
      </div>

      <div className="min-w-6"></div>

      <button
        className={`fixed bottom-4 right-4 ${showChatSettings && 'mr-[374px]'}`}
        type="submit"
      >
        <SendHorizontalIcon
          className={`transition-colors ${!message ? 'text-[#374151]' : 'text-blue-500'}`}
          fill={`${!message ? '#374151' : '#3b82f6'}`}
        />
      </button>
    </form>
  );
}
