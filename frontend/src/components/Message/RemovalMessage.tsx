import { BanIcon } from 'lucide-react';

interface RemovalMessageProps {
  show: boolean;
  type: 'post' | 'comment';
  className?: string;
}

export default function RemovalMessage({ show, type, className }: RemovalMessageProps) {
  return (
    show && (
      <div className={`my-4 post-message ${className}`}>
        <BanIcon className="flex-shrink-0 text-red-500" />

        <span className="break-works">
          Sorry, this {type} has been removed by the moderators.
        </span>
      </div>
    )
  );
}
