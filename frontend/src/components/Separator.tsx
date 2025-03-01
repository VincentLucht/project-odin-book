interface SeparatorProps {
  mode?: 'normal' | 'sidebar';
}

export default function Separator({ mode = 'normal' }: SeparatorProps) {
  return (
    <hr
      className={`h-[1px] border-0 bg-gray-600 ${mode === 'sidebar' && 'my-3 w-[215px]'}`}
    />
  );
}
