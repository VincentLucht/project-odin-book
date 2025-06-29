interface ContentLazyProps {
  contentLines: number;
  lastLineRandom: number;
}

export default function ContentLazy({
  contentLines,
  lastLineRandom,
}: ContentLazyProps) {
  return (
    <div className="!mb-4 !mt-2">
      {Array.from({ length: contentLines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton h-6 ${i === 0 && 'rounded-t-md'} ${i === contentLines - 1 && 'rounded-b-md'}
          ${i === contentLines - 2 && 'rounded-bl-none rounded-br-md'} `}
          style={i === contentLines - 1 ? { width: `${lastLineRandom}%` } : {}}
        />
      ))}
    </div>
  );
}
