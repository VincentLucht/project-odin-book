import { useEffect, ReactNode } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import { animated, SpringValue } from '@react-spring/web';
import { useModalTransition } from '@/components/Modal/hooks/userModalTransition';

// MODAL
interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const Modal = ({ show, onClose, children, className }: ModalProps) => {
  const { contentTransition, backdropTransition } = useModalTransition(show);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [show]);

  return (
    <>
      {backdropTransition(
        (styles, item) => item && <Backdrop styles={styles} onClose={onClose} />,
      )}

      {contentTransition(
        (styles, item) =>
          item && (
            <ModalContainer styles={styles} onClose={onClose} className={className}>
              {children}
            </ModalContainer>
          ),
      )}
    </>
  );
};

// MODAL CONTAINER
interface ModalContainerProps {
  styles: {
    opacity: SpringValue<number>;
    scale?: SpringValue<number>;
  };
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export const ModalContainer = ({
  styles,
  onClose,
  children,
  className,
}: ModalContainerProps) => {
  const containerRef = useClickOutside(onClose);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      <animated.div
        style={styles}
        className={`flex max-h-full w-full min-w-[300px] max-w-[500px] flex-col rounded-lg bg-gray
          ${className}`}
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4 overflow-y-auto p-3">{children}</div>
      </animated.div>
    </div>
  );
};

// BACKDROP
interface BackdropProps {
  styles: {
    opacity: SpringValue<number>;
    scale?: SpringValue<number>;
  };
  onClose: () => void;
}

export const Backdrop = ({ styles, onClose }: BackdropProps) => (
  <animated.div
    style={styles}
    className="fixed inset-0 z-40 bg-black"
    onClick={onClose}
  />
);
