interface CommunityPFPProps {
  src: string | undefined | null;
  size?: 'normal' | 'large';
}

export default function CommunityPFPSmall({ src, size = 'normal' }: CommunityPFPProps) {
  return (
    <img
      src={src ?? '/community-default.svg'}
      alt="Community Profile Picture"
      className={`${size === 'normal' ? 'h-6 w-6' : 'h-9 w-9'} rounded-full border`}
    />
  );
}
