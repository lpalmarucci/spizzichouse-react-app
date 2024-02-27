import MatchList from '../components/Match/MatchList.component.tsx';
import { Button, Spinner, Tab, Tabs } from '@nextui-org/react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { useTranslation } from 'react-i18next';
import CreateEditMatchDialog from '../components/Match/Dialog/CreateEditMatchDialog.component.tsx';
import React, { useEffect, useState } from 'react';
import { Match } from '../models/Match.ts';
import useFetch from '../hooks/useFetch.tsx';
import ApiEndpoints from '../costants/ApiEndpoints.ts';
import {
  DialogProvider,
  useDialogContext,
} from '../context/Dialog.context.tsx';

//Fetch here all the matches available
type Filter = { key: 'all' | 'in_progress'; text: string };

function MatchesPage() {
  const {
    isDialogOpen,
    onDialogOpenChange,
    selectedData,
    openCreateEditDialog,
  } = useDialogContext<Match>();
  const { t } = useTranslation();
  const fetchData = useFetch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatchFilter, setSelectedMatchFilter] =
    useState<Filter['key']>();

  const MATCH_FILTER: Filter[] = React.useMemo(
    () => [
      {
        key: 'all',
        text: t('labels.all'),
      },
      {
        key: 'in_progress',
        text: t('matches.labels.inProgress'),
      },
    ],
    [t],
  );

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    try {
      setIsLoading(true);
      const data = await fetchData<Match[]>(ApiEndpoints.getMatches, 'GET');
      setMatches(data);
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      setIsLoading(false);
    }
  };
  const filteredMatches = React.useMemo<Match[]>(() => {
    if (selectedMatchFilter === 'all') return matches.slice();

    return matches.filter((m) => m.inProgress);
  }, [matches, selectedMatchFilter]);

  return (
    <div className="flex flex-col gap-12 items-center align-middle mx-auto w-full px-6 max-w-6xl">
      <h1 className="text-6xl text-foreground font-bold">
        {t('matches.title')}
      </h1>
      <div className="w-full flex items-center justify-between">
        <Tabs
          aria-label="Filtri match"
          selectedKey={selectedMatchFilter}
          onSelectionChange={(val) =>
            setSelectedMatchFilter(val as Filter['key'])
          }
        >
          {MATCH_FILTER.map((filter) => (
            <Tab key={filter.key} title={filter.text} />
          ))}
        </Tabs>
        <Button
          className="self-end"
          color="primary"
          endContent={<PlusIcon />}
          onPress={openCreateEditDialog}
        >
          {t('buttons.crateNewMatch')}
        </Button>
      </div>
      {isLoading ? (
        <Spinner label={t('loading')} />
      ) : (
        <MatchList matches={filteredMatches} getAllMatches={getMatches} />
      )}
      <CreateEditMatchDialog
        isOpen={isDialogOpen}
        onOpenChange={onDialogOpenChange}
        match={selectedData}
        onCloseDialog={() => getMatches()}
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
