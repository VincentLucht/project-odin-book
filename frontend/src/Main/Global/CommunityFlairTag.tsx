interface CommunityFlairTag {
  flair: {
    name: string;
    emoji: string | null;
    textColor: string;
    color: string;
  };
  className?: string;
}

export default function CommunityFlairTag({ flair, className }: CommunityFlairTag) {
  return (
    <div
      className={`w-fit cursor-default select-none gap-1 rounded-full px-2 text-xs df ${className}`}
      style={{ backgroundColor: flair.color, color: flair.textColor }}
    >
      <span>{flair.name}</span>

      <span>{flair.emoji && flair.emoji}</span>
    </div>
  );
}
