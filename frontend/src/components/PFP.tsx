interface CommunityPFPProps {
  src: string | undefined | null;
  size?: 'normal' | 'large' | 'xl';
  mode?: 'community' | 'user';
  className?: string;
}

const sizeClasses = {
  normal: 'h-6 w-6',
  large: 'h-9 w-9',
  xl: 'h-12 w-12',
};

export default function PFP({
  src,
  size = 'normal',
  mode = 'community',
  className,
}: CommunityPFPProps) {
  const pfp =
    mode === 'user'
      ? src && src.trim() !== ''
        ? src
        : '/user.svg'
      : src && src.trim() !== ''
        ? src
        : '/community-default.svg';
  return (
    <img
      src={pfp}
      alt={`${mode === 'community' ? 'Community Profile Picture' : 'User Profile Picture'}`}
      className={`${sizeClasses[size] ?? sizeClasses.normal} ${className} flex-shrink-0 rounded-full
        border object-cover`}
      loading="lazy"
    />
  );
}
