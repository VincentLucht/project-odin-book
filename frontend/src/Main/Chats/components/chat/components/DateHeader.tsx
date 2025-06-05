export default function DateHeader({ label }: { label: string }) {
  return (
    <div
      className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2"
      style={{ transform: 'scaleY(-1)' }}
    >
      <div className="h-[1px] border-b-[0.5px] border-[#ffffff5a]"></div>

      <div className="text-sm font-medium df text-gray-secondary">{label}</div>

      <div className="h-[1px] border-b-[0.5px] border-[#ffffff5a]"></div>
    </div>
  );
}
