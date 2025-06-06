interface SwitchLazyProps {
  label: string;
  description: string;
}

export default function SwitchLazy({ label, description }: SwitchLazyProps) {
  return (
    <div className={'flex w-full items-center justify-between py-2'}>
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div className="skeleton h-6 w-12 rounded-full"></div>
    </div>
  );
}
