import { DotIcon } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

interface LevelIndicatorProps {
  level: number;
  maxLevel?: number;
}

export default function LevelIndicator({ level, maxLevel = 4 }: LevelIndicatorProps) {
  const positions = Array.from({ length: maxLevel }, (_, i) => i * 12);

  const spring = useSpring({
    left: positions[level - 1],
    config: { tension: 280, friction: 24 },
  });

  return (
    <div className="relative ml-[6px] flex gap-3">
      {/* Static gray dots */}
      {Array.from({ length: maxLevel }, (_, i) => (
        <DotIcon key={i + 1} className="-m-3 text-gray-500" strokeWidth={4} />
      ))}

      {/* moving indicator indicator */}
      <animated.div className="pointer-events-none absolute top-0" style={spring}>
        <DotIcon className="-m-3 text-white" strokeWidth={4} />
      </animated.div>
    </div>
  );
}
