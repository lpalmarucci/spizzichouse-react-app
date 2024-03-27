import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

interface IAlertDialogProps {
  title?: React.ReactNode;
  contentText?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
  onConfirm?: () => void;
  confirmButtonText?: string;
  onCancel?: () => void;
}

const AlertDialog = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  onOpenChange,
  contentText,
  confirmButtonText = 'Elimina',
}: IAlertDialogProps) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      onClose={() => onCancel?.()}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title ?? t('labels.attention')}</ModalHeader>
            <ModalBody>{contentText ?? t('defaultAlertText')}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                {t('buttons.cancel')}
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await onConfirm?.call(this);
                  onClose();
                }}
              >
                {confirmButtonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AlertDialog;
