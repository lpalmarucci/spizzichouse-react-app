import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';

interface IAlertDialogProps {
  title?: React.ReactNode;
  contentText?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm?: () => void;
}

const AlertDialog = ({
  isOpen,
  title,
  onConfirm,
  onOpenChange,
  contentText,
}: IAlertDialogProps) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
    <ModalContent>
      {(onClose) => (
        <>
          <ModalHeader>{title ?? 'Attention'}</ModalHeader>
          <ModalBody>
            {contentText ?? 'Are you sure you want to proceed?'}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={async () => {
                await onConfirm?.call(this);
                onClose();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </>
      )}
    </ModalContent>
  </Modal>
);

export default AlertDialog;
