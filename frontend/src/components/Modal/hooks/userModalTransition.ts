import { useTransition } from '@react-spring/web';

/**
 * Custom hook for react-spring modal transitions.
 */
export const useModalTransition = (show: boolean) => {
  const contentTransition = useTransition(show, {
    from: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.9 },
    config: { tension: 280, friction: 20, clamp: true },
  });

  const backdropTransition = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 0.3 },
    leave: { opacity: 0 },
    config: { tension: 280, friction: 20 },
  });

  return {
    contentTransition,
    backdropTransition,
  };
};
