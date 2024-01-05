import MatchList from '../components/Matches/MatchList.component.tsx';
import { Button, useDisclosure } from '@nextui-org/react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { useTranslation } from 'react-i18next';
import CreateEditMatchDialog from '../components/Match/CreateEditMatchDialog.component.tsx';
import { useEffect, useState } from 'react';
import { Match } from '../models/Match.ts';
import { ApiEndpoint } from '../models/constants.ts';
import useFetch from '../hooks/useFetch.tsx';

//Fetch here all the matches available

function MatchesPage() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fetchData = useFetch();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = () =>
    fetchData<Match[]>(ApiEndpoint.getMatches, 'GET').then((data) =>
      setMatches(data),
    );

  return (
    <div className="flex flex-col gap-12 items-center align-middle mx-auto w-full px-6 max-w-5xl">
      <h1 className="text-6xl text-foreground font-bold">Lista partite</h1>
      <Button
        className="self-end"
        color="primary"
        endContent={<PlusIcon />}
        onPress={onOpen}
      >
        {t('buttons.addNew')}
      </Button>
      <MatchList matches={matches} />
      <CreateEditMatchDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCloseDialog={() => getMatches()}
      />
    </div>
  );
}

export default MatchesPage;
