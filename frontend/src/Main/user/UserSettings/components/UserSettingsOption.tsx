import { ChevronRightIcon } from 'lucide-react';

interface UserSettingsCompartmentProps {
  name: string;
  onClick: () => void;
  additionalName?: string;
}

export default function UserSettingsOption({
  name,
  onClick,
  additionalName,
}: UserSettingsCompartmentProps) {
  return (
    <button
      className="-ml-2 flex cursor-pointer items-center justify-between rounded py-2 pl-2 text-sm
        bg-transition-hover"
      onClick={onClick}
    >
      <span>{name}</span>

      <div className="flex items-center gap-4">
        <span className="text-xs">{additionalName}</span>

        <ChevronRightIcon />
      </div>
    </button>
  );
}
