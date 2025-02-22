interface SpoilerBodyProps {
  isMature: boolean;
  isSpoiler: boolean;
  setShowMature: React.Dispatch<React.SetStateAction<boolean>>;
  setShowSpoiler: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function HideContent({
  isMature,
  isSpoiler,
  setShowMature,
  setShowSpoiler,
}: SpoilerBodyProps) {
  let textContent = '';
  if (isMature && isSpoiler) {
    textContent = 'View NSFW content & spoilers';
  } else if (isMature) {
    textContent = 'View NSFW content';
  } else if (isSpoiler) {
    textContent = 'View spoilers';
  }

  const onClick = () => {
    if (isMature && isSpoiler) {
      setShowMature(true);
      setShowSpoiler(true);
    } else if (isMature) {
      setShowMature(true);
    } else if (isSpoiler) {
      setShowSpoiler(true);
    }
  };

  return (
    <button
      className="h-28 w-full cursor-pointer rounded-xl bg-neutral-950 transition-colors df
        hover:bg-neutral-900"
      onClick={onClick}
    >
      <div className="rounded-full bg-black px-3 py-1 text-sm">{textContent}</div>
    </button>
  );
}
