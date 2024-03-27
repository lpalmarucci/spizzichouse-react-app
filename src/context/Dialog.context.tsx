import React, { PropsWithChildren, useState } from 'react';
import { useDisclosure } from '@nextui-org/react';

export interface IDialogContextProps<T extends object | undefined> {
  selectedData: T | undefined;
  setSelectedData: React.Dispatch<React.SetStateAction<T | undefined>>;
  isDialogOpen: boolean;
  onDialogOpenChange: () => void;
  openDialog: () => void;
  closeDialog: () => void;
}

const DialogContext = React.createContext<IDialogContextProps<any>>(
  {} as IDialogContextProps<any>,
);

export const useDialogContext = <T extends object>() =>
  React.useContext<IDialogContextProps<T>>(DialogContext);

export const DialogProvider = <T extends object | undefined>(
  props: PropsWithChildren,
) => {
  const [selectedData, setSelectedData] = useState<T | undefined>();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <DialogContext.Provider
      value={{
        selectedData,
        setSelectedData,
        isDialogOpen: isOpen,
        openDialog: onOpen,
        onDialogOpenChange: onOpenChange,
        closeDialog: onClose,
      }}
    >
      {props.children}
    </DialogContext.Provider>
  );
};
