interface SwitchProps {
  id: string;
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  activeColor?: string;
  inactiveColor?: string;
  className?: string;
}

export default function Switch({
  id,
  name = 'toggle',
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  activeColor = 'bg-blue-600',
  inactiveColor = 'bg-gray-300',
  className = '',
}: SwitchProps) {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = e.target.checked;

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`flex w-full items-center justify-between py-2 ${className}`}>
      {(label ?? description) && (
        <div>
          {label && <h4 className="font-medium">{label}</h4>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}

      <div className="relative inline-block w-12 select-none align-middle">
        <input
          type="checkbox"
          name={name}
          id={id}
          className={`absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4
            ${checked ? 'bg-white' : 'bg-gray-500'} checked:right-0 checked:border-blue-600`}
          checked={checked}
          onChange={handleToggle}
          disabled={disabled}
          style={{
            transition: 'all 0.2s ease',
            top: '0',
            outline: 'none',
          }}
        />

        <label
          htmlFor={id}
          className={`block h-6 cursor-pointer overflow-hidden rounded-full ${
            checked ? activeColor : inactiveColor }`}
          style={{ transition: 'background-color 0.2s ease' }}
        ></label>
      </div>
    </div>
  );
}
