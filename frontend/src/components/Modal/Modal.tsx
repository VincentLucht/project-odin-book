import useClickOutside from '@/hooks/useClickOutside';
import { animated, SpringValue } from '@react-spring/web';
import { useModalTransition } from '@/components/Modal/hooks/userModalTransition';
import { ReactNode } from 'react';

// MODAL
interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}
export const Modal = ({ show, onClose, children, className }: ModalProps) => {
  const { contentTransition, backdropTransition } = useModalTransition(show);

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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <animated.div
        style={styles}
        className={`flex max-h-[600px] w-full min-w-[300px] max-w-[500px] flex-col gap-4 rounded-lg p-3
          bg-gray ${className}`}
        ref={containerRef}
      >
        {children}
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
