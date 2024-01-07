import MatchList from '../components/Match/MatchList.component.tsx';
import { Button, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { useTranslation } from 'react-i18next';
import CreateEditMatchDialog from '../components/Match/Dialog/CreateEditMatchDialog.component.tsx';
import React, { useEffect, useState } from 'react';
import { Match } from '../models/Match.ts';
import { ApiEndpoint } from '../models/constants.ts';
import useFetch from '../hooks/useFetch.tsx';

//Fetch here all the matches available
type Filter = { key: 'all' | 'in_progress'; text: string };

function MatchesPage() {
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fetchData = useFetch();
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
    [],
  );

  useEffect(() => {
    getMatches();
  }, []);

  const getMatches = async () => {
    try {
      const data = await fetchData<Match[]>(ApiEndpoint.getMatches, 'GET');
      setMatches(data);
      return Promise.resolve(data);
    } catch (e) {
      return Promise.reject(e);
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
          onPress={onOpen}
        >
          {t('buttons.addNew')}
        </Button>
      </div>
      <MatchList matches={filteredMatches} getAllMatches={getMatches} />
      <CreateEditMatchDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCloseDialog={() => getMatches()}
      />
    </div>
  );
}

export default MatchesPage;
