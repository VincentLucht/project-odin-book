import TextareaAutosize from 'react-textarea-autosize';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';

interface ModalTextAreaProps {
  labelName: string;
  value: string;
  setterFunc: (value: string) => void;
  maxLength: number;
  required?: boolean;
}

export default function ModalTextArea({
  labelName,
  value,
  setterFunc,
  maxLength,
  required = false,
}: ModalTextAreaProps) {
  return (
    <div>
      <label className="-mb-2 font-medium" htmlFor="modal-message">
        {labelName}
      </label>

      <TextareaAutosize
        id="modal-message"
        className="!py-2 modal-input"
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
