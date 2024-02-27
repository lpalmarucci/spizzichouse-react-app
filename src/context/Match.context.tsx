import { Match } from '../models/Match.ts';
import React, { PropsWithChildren, useState } from 'react';
import { useDisclosure } from '@nextui-org/react';

export type MatchContextProps = {
  selectedMatch: Match | undefined;
  setSelectedMatch: React.Dispatch<React.SetStateAction<Match | undefined>>;
  isDialogOpen: boolean;
  onDialogOpenChange: () => void;
  openCreateEditDialog: () => void;
};

const MatchContext = React.createContext<MatchContextProps>(
  {} as MatchContextProps,
);

export const useMatchContext = () => React.useContext(MatchContext);

export const MatchProvider = (props: PropsWithChildren) => {
  const [selectedMatch, setSelectedMatch] = useState<Match | undefined>(
    undefined,
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <MatchContext.Provider
      value={{
        selectedMatch,
        setSelectedMatch,
        isDialogOpen: isOpen,
        openCreateEditDialog: onOpen,
        onDialogOpenChange: onOpenChange,
      }}
    >
      {props.children}
    </MatchContext.Provider>
  );
};
