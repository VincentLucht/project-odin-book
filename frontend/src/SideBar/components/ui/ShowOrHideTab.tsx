import { useTransition, useSpring, animated } from '@react-spring/web';
import { ChevronUpIcon } from 'lucide-react';
import useMeasure from 'react-use-measure';

interface ShowOrHideTabProps {
  show: boolean;
  tabName: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}

export default function ShowOrHideTab({
  show,
  tabName,
  setShow,
  children,
}: ShowOrHideTabProps) {
  const [ref, { height }] = useMeasure();

  const transitions = useTransition(!show, {
    from: { opacity: 0, height: 0 },
    enter: { opacity: 1, height: height > 0 ? height : 'auto' },
    leave: { opacity: 0, height: 0 },
    config: {
      mass: 0.7,
      tension: 400,
      friction: 18,
      clamp: true,
    },
  });
  const iconSpring = useSpring({
    transform: show ? 'rotate(180deg)' : 'rotate(0deg)',
    config: { mass: 1, tension: 200, friction: 26 },
  });

  return (
    <div>
      <button
        className="flex justify-between !pl-3 text-gray-400 sidebar-btn"
        onClick={() => setShow((v) => !v)}
      >
        {tabName}
        <animated.div style={iconSpring}>
          <ChevronUpIcon className="h-5 w-5 text-white" />
        </animated.div>
      </button>

      {transitions(
        (styles, item) =>
          item && (
            <animated.div style={styles}>
              <div ref={ref}>{children}</div>
            </animated.div>
          ),
      )}
    </div>
  );
}
