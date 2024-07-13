import { Accordion, AccordionItem, Button, Select, SelectItem } from '@nextui-org/react';
import Title from '../Title.component.tsx';
import { useEffect, useState } from 'react';
import { Player } from '../../models/Player.ts';
import useFetch from '../../hooks/useFetch.tsx';
import ApiEndpoints from '../../costants/ApiEndpoints.ts';
import { Location } from '../../models/Location.ts';
import { useTranslation } from 'react-i18next';

export interface IMatchFilters {
  user?: Set<number>;
  location?: Set<number>;
  inProgress?: Set<string>;
}

interface IMatchFiltersProps {
  onSearch: (filters: IMatchFilters) => Promise<void>;
}

function MatchFilters(props: IMatchFiltersProps) {
  const [filters, setFilters] = useState<IMatchFilters>({
    user: new Set<number>(),
    location: new Set<number>(),
    inProgress: new Set<string>(),
  });
  const [users, setUsers] = useState<Player[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const fetchData = useFetch();
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchUsers() {
      const users = await fetchData<Player[]>(ApiEndpoints.getUsers, 'GET');
      setUsers(users);
    }

    async function fetchLocations() {
      const locations = await fetchData<Location[]>(ApiEndpoints.getLocations, 'GET');
      setLocations(locations);
    }

    Promise.all([fetchUsers(), fetchLocations()]);
  }, []);

  function handleResetFilters() {
    const resettedFilters: IMatchFilters = {
      user: new Set<number>(),
      location: new Set<number>(),
    };
    setFilters(resettedFilters);
    props.onSearch(resettedFilters);
  }

  function handleSubmitFilters() {
    props.onSearch(filters);
  }

  return (
    <div className="flex w-full">
      <Accordion variant="shadow">
        <AccordionItem title={<Title className="text-xl">Filtri avanzati</Title>}>
          <div className="flex flex-col w-full gap-6 min-h-unit-8 px-0 md:pb-4 pb-6">
            <div className="flex flex-wrap gap-3 md:gap-4 md:flex-row items-center">
              <Select
                label={t('labels.players')}
                placeholder={t('placeholders.selectUser')}
                className="flex-1"
                variant="bordered"
                key="utenti"
                size="md"
                selectedKeys={filters.user}
                onSelectionChange={(id) => setFilters((prev) => ({ ...prev, user: id as Set<number> }))}
              >
                {users.length > 0 ? (
                  users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.username}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem isDisabled key="">
                    {t('players.not_available')}
                  </SelectItem>
                )}
              </Select>
              <Select
                label={t('labels.location')}
                placeholder={t('placeholders.selectLocation')}
                className="flex-1"
                variant="bordered"
                key="locations"
                size="md"
                selectedKeys={filters.location}
                onSelectionChange={(id) => setFilters((prev) => ({ ...prev, location: id as Set<number> }))}
              >
                {locations.length > 0 ? (
                  locations.map((location) => <SelectItem key={location.id}>{location.name}</SelectItem>)
                ) : (
                  <SelectItem isDisabled key="">
                    {t('locations.not_available')}
                  </SelectItem>
                )}
              </Select>
              <Select
                label={t('labels.status')}
                placeholder={t('placeholders.selectStatus')}
                className="flex-1"
                variant="bordered"
                key="status"
                size="md"
                selectedKeys={filters.inProgress}
                onSelectionChange={(status) => setFilters((prev) => ({ ...prev, inProgress: status as Set<string> }))}
              >
                <SelectItem key={'true'}>{t('matches.labels.inProgress')}</SelectItem>
                <SelectItem key={'false'}>{t('matches.labels.ended')}</SelectItem>
              </Select>
            </div>
            <div className="flex gap-2 items-center">
              <Button variant="ghost" color="primary" size="md" className="w-fit" onClick={handleSubmitFilters}>
                {t('buttons.search')}
              </Button>
              <Button variant="light" size="md" className="w-fit" onClick={handleResetFilters}>
                {t('buttons.reset')}
              </Button>
            </div>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export default MatchFilters;
