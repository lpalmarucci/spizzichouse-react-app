import React, { PropsWithChildren, useState } from 'react';
import { useDisclosure } from '@nextui-org/react';

export interface IDialogContextProps<T extends object | undefined> {
  selectedData: T;
  setSelectedData: React.Dispatch<React.SetStateAction<T>>;
  isDialogOpen: boolean;
  onDialogOpenChange: () => void;
  openCreateEditDialog: () => void;
}

const DialogContext = React.createContext<IDialogContextProps<any>>(
  {} as IDialogContextProps<any>,
);

export const useDialogContext = <T extends object>() =>
  React.useContext<IDialogContextProps<T>>(DialogContext);

export const DialogProvider = <T extends object | undefined>(
  props: PropsWithChildren,
) => {
  const [selectedData, setSelectedData] = useState<T>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <DialogContext.Provider
      value={{
        selectedData,
        setSelectedData,
        isDialogOpen: isOpen,
        openCreateEditDialog: onOpen,
        onDialogOpenChange: onOpenChange,
      }}
    >
      {props.children}
    </DialogContext.Provider>
  );
};
