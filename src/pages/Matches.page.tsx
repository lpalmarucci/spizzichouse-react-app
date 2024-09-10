import MatchList from '../components/Match/MatchList.component.tsx';
import { Button, Spinner } from '@nextui-org/react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { useTranslation } from 'react-i18next';
import CreateEditMatchDialog from '../components/Match/Dialog/CreateEditMatchDialog.component.tsx';
import { useEffect, useState } from 'react';
import { Match } from '../models/Match.ts';
import useFetch from '../hooks/useFetch.tsx';
import ApiEndpoints from '../costants/ApiEndpoints.ts';
import { DialogProvider, useDialogContext } from '../context/Dialog.context.tsx';
import MatchFilters, { IMatchFilters } from '../components/Match/MatchFilters.component.tsx';

function MatchesPage() {
  const { isDialogOpen, onDialogOpenChange, selectedData, openDialog } = useDialogContext<Match>();
  const { t } = useTranslation();
  const fetchData = useFetch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    getMatches({});
  }, []);

  const getMatches = async (filters: IMatchFilters) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]: [string, Set<unknown>]) => {
        if (value.size > 0) params.set(key, Array.from(value).toString());
      });
      const data = await fetchData<Match[]>(`${ApiEndpoints.getMatches}?${params}`, 'GET', {});
      setMatches(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center align-middle mx-auto w-full px-6 max-w-6xl">
      <h1 className="text-6xl text-foreground font-bold">{t('matches.title')}</h1>

      <MatchFilters onSearch={getMatches} />
      <div className="w-full flex items-center justify-end">
        <Button className="self-end" color="primary" endContent={<PlusIcon />} onPress={openDialog}>
          {t('buttons.crateNewMatch')}
        </Button>
      </div>
      {isLoading ? <Spinner label={t('loading')} /> : <MatchList matches={matches} getAllMatches={getMatches} />}
      <CreateEditMatchDialog
        isOpen={isDialogOpen}
        onOpenChange={onDialogOpenChange}
        match={selectedData}
        onCloseDialog={() => getMatches({})}
      />
    </div>
  );
}

const MatchesPageWrapper = () => (
  <DialogProvider>
    <MatchesPage />
  </DialogProvider>
);

export default MatchesPageWrapper;
