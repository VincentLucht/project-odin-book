import { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import useMeasure from 'react-use-measure';

import { ChevronUpIcon } from 'lucide-react';

import { DBCommunityRule } from '@/interface/dbSchema';

interface RuleTabProps {
  rule: DBCommunityRule;
}

export default function RuleTab({ rule }: RuleTabProps) {
  const [show, setShow] = useState(false);
  const [ref, { height }] = useMeasure();

  const contentAnimation = useSpring({
    height: show ? height : 0,
    opacity: show ? 1 : 0,
    config: {
      mass: 0.7,
      tension: 400,
      friction: 18,
      clamp: true,
    },
  });

  const iconAnimation = useSpring({
    transform: show ? 'rotate(0deg)' : 'rotate(180deg)',
    config: { mass: 1, tension: 200, friction: 26 },
  });

  return (
    <div>
      <div
        className="bg-transition-hover-2 -mx-2 flex cursor-pointer items-center rounded-md p-2 text-sm"
        onClick={() => setShow((v) => !v)}
      >
        <div className="mr-1 w-6 font-medium df">{rule.order}</div>

        <div className="flex-grow font-medium">{rule.title}</div>

        <animated.div style={iconAnimation}>
          <ChevronUpIcon className="h-5 w-5" />
        </animated.div>
      </div>

      <animated.div
        style={{
          ...contentAnimation,
          overflow: 'hidden',
        }}
      >
        <div ref={ref} className="ml-7 pt-2 text-sm">
          {rule.text}
        </div>
      </animated.div>
    </div>
  );
}
