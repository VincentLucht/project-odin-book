import { ImageIcon } from 'lucide-react';
import { TrashIcon } from 'lucide-react';

interface AddOrRemoveProps {
  value: string | null;
  setterFunc: React.Dispatch<React.SetStateAction<string | null>>;
  name: string;
  onAdd: () => void;
  subText?: React.ReactNode;
}

export default function AddOrRemove({
  value,
  setterFunc,
  name,
  onAdd,
  subText,
}: AddOrRemoveProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>

          <span className="text-sm text-gray-secondary">{subText}</span>
        </div>

        <button
          className="flex h-8 items-center gap-2 !px-3 text-sm prm-button-blue"
          onClick={onAdd}
        >
          <ImageIcon />
          {value ? 'Change' : 'Add'}
        </button>
      </div>

      {value && (
        <div
          className="mt-2 flex items-center justify-between gap-2 break-all rounded-md border border-gray-600
            p-2 px-4 text-xs text-gray-400"
        >
          {value}
          <button
            className="transition-transform hover:scale-105 active:scale-95"
            onClick={() => setterFunc(null)}
          >
            <TrashIcon className="h-5 w-5 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}
