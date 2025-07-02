import { TrashIcon } from 'lucide-react';

interface DeletedByPosterProps {
  message?: string;
  type?: string;
}

export default function DeletedByPoster({ message, type }: DeletedByPosterProps) {
  return (
    <div className="my-4 post-message">
      <TrashIcon className="flex-shrink-0 text-red-500" />

      <span className="break-words">
        {message
          ? message
          : `Sorry, this ${type} was deleted by the person who originally posted it`}
      </span>
    </div>
  );
}
