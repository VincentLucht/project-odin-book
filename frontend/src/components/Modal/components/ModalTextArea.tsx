import TextareaAutosize from 'react-textarea-autosize';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';

interface ModalTextAreaProps {
  labelName: string;
  value: string;
  setterFunc: (value: string) => void;
  maxLength: number;
  required?: boolean;
  className?: string;
}

export default function ModalTextArea({
  labelName,
  value,
  setterFunc,
  maxLength,
  required = false,
  className = '',
}: ModalTextAreaProps) {
  return (
    <div className="overscroll-contain">
      <label className="-mb-2 font-medium" htmlFor="modal-message">
        {labelName}
      </label>

      <TextareaAutosize
        id="modal-message"
        className={`max-h-[40dvh] min-h-[80px] overscroll-contain !py-2 modal-input ${className}`}
        value={value}
        onChange={(e) => setterFunc(e.target.value)}
        minRows={3}
        required={required}
        maxLength={maxLength}
      />
      <MaxLengthIndicator length={value.length} maxLength={maxLength} />
    </div>
  );
}
