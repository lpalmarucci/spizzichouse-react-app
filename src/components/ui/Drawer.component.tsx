import React, { PropsWithChildren } from 'react';
import { Modal, ModalContent } from '@nextui-org/react';

interface Props extends PropsWithChildren {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CustomDrawer: React.FC<Props> = ({ isOpen, onOpenChange, children }) => {
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="opaque"
      size="full"
      classNames={{
        wrapper: 'flex justify-end',
      }}
      motionProps={{
        variants: {
          enter: {
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            x: 50,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
      className="rounded-md max-w-sm w-full h-screen max-h-screen"
    >
      <ModalContent>{() => <>{children}</>}</ModalContent>
    </Modal>
  );
};

export default CustomDrawer;
