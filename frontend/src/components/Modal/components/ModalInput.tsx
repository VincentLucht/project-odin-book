import MaxLengthIndicator from '@/components/MaxLengthIndicator';

interface ModalInputProps {
  labelName: string;
  value: string;
  setterFunc: (value: string) => void;
  maxLength: number;
}

export default function ModalInput({
  labelName,
  value,
  setterFunc,
  maxLength,
}: ModalInputProps) {
  return (
    <div>
      <label className="-mb-2 font-medium" htmlFor="modal-subject">
        {labelName}
      </label>

      <input
        id="modal-subject"
        type="text"
        className="!py-2 modal-input"
        value={value}
        onChange={(e) => setterFunc(e.target.value)}
        required
        autoComplete="off"
        maxLength={maxLength}
      />

      <MaxLengthIndicator length={value.length} maxLength={maxLength} />
    </div>
  );
}
