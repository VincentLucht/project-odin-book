export default function ChatOverviewSkeletons() {
  // Generate random widths for usernames (3-20 chars) and text (6-35 chars)
  const generateSkeletons = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      usernameWidth: Math.floor(Math.random() * 18) + 3,
      textWidth: Math.floor(Math.random() * 30) + 6,
    }));
  };
  const skeletons = generateSkeletons();

  return (
    <div className="space-y-1">
      {skeletons.map(({ id, usernameWidth, textWidth }) => (
        <div
          key={id}
          className="flex h-8 min-h-[60px] w-full items-center gap-2 px-3 py-2"
        >
          {/* PFP */}
          <div className="skeleton h-8 w-8 shrink-0 animate-pulse rounded-full bg-gray-300"></div>

          <div className="min-w-0 flex-1">
            {/* USERNAME + DATE */}
            <div className="flex items-center justify-between gap-1">
              <div
                className="skeleton mb-1 h-4 animate-pulse rounded bg-gray-300"
                style={{ width: `${usernameWidth * 0.5}rem` }}
              ></div>

              <div className="skeleton mb-1 h-3 w-[32px] rounded"></div>
            </div>

            {/* TEXT */}
            <div
              className="skeleton h-3 animate-pulse rounded bg-gray-200"
              style={{ width: `${textWidth * 0.4}rem` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
