import { HexColorPicker } from 'react-colorful';

interface ColorPickerPanelProps {
  title: string;
  color: string;
  onColorChange: (newColor: string) => void;
  labelText?: string;
}

export default function ColorPickerPanel({
  title,
  color,
  onColorChange,
  labelText = 'Hex code (optional)',
}: ColorPickerPanelProps) {
  return (
    <div className="mt-2">
      <h4 className="mb-3 font-medium">{title}</h4>
      <HexColorPicker
        color={color}
        onChange={onColorChange}
        style={{ width: '160px', height: '170px' }}
      />

      <div className="mt-4 flex flex-col">
        <label
          htmlFor={`${title.toLowerCase()}-color`}
          className="ml-4 text-sm text-gray-secondary"
        >
          {labelText}
        </label>

        <input
          id={`${title.toLowerCase()}-color`}
          type="text"
          className="w-full max-w-[160px] rounded-full px-4 py-2 focus-blue"
          placeholder="Hex code"
          maxLength={7}
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
        />
      </div>
    </div>
  );
}
