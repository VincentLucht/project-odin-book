import formatDate from '@/util/formatDate';
import { CakeSliceIcon } from 'lucide-react';

interface DisplayCreationDateProps {
  creationDate: string | Date;
}

export default function DisplayCreationDate({
  creationDate,
}: DisplayCreationDateProps) {
  return (
    <div className="flex items-center gap-1">
      <CakeSliceIcon
        className="h-[18px] w-[18px] scale-x-[-1] transform"
        strokeWidth={1.7}
      />

      <span className="text-sm font-light df">Created {formatDate(creationDate)}</span>
    </div>
  );
}
