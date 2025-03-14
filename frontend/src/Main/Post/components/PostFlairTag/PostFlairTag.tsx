import { PostAssignedFlair } from '@/interface/dbSchema';

interface PostFlairTagProps {
  showFlair: boolean;
  postAssignedFlair: PostAssignedFlair;
  className?: string;
}

export default function PostFlairTag({
  showFlair,
  postAssignedFlair,
  className,
}: PostFlairTagProps) {
  if (!postAssignedFlair?.length && showFlair) {
    return null;
  }

  const flair = postAssignedFlair[0].community_flair;

  return (
    <div
      className={`w-fit gap-1 rounded-full px-2 text-xs df ${className}`}
      style={{ backgroundColor: flair.color, color: flair.textColor }}
    >
      <span>{flair.name}</span>

      <span>{flair.emoji && flair.emoji}</span>
    </div>
  );
}
