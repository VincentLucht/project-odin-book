import LazyCompartment from '@/components/Lazy/LazyCompartment';

interface LazyTagsProps {
  isMature?: boolean;
  isSpoiler?: boolean;
  includeMatureTag?: boolean;
  className?: string;
}

export default function LazyTags({
  isMature = false,
  isSpoiler = false,
  includeMatureTag = true,
  className,
}: LazyTagsProps) {
  return (
    <>
      {(isMature || isSpoiler) && (
        <div className={`my-1 flex items-center gap-1 ${className}`}>
          {isMature && includeMatureTag && <LazyCompartment width={62} height={22} />}
          {isSpoiler && <LazyCompartment width={73} height={22} />}
        </div>
      )}
    </>
  );
}
