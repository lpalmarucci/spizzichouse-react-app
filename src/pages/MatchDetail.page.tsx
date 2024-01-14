import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.tsx';
import { AggregatedRound, Round, StatusPlayer } from '../models/Round.ts';
import { ApiEndpoint } from '../models/constants.ts';
import { Button, Spinner, useDisclosure } from '@nextui-org/react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { useTranslation } from 'react-i18next';
import { Match } from '../models/Match.ts';
import CreateEditRoundDialog from '../components/Round/Dialog/CreateEditRoundDialog.component.tsx';
import RoundList from '../components/Round/RoundList.component.tsx';

function MatchDetailPage() {
  const { t } = useTranslation();
  const [isLoadingRounds, setLoadingRounds] = useState<boolean>(true);
  const [aggregatedRounds, setAggregatedRounds] = useState<AggregatedRound[]>(
    [],
  );
  const [currentMatch, setCurrentMatch] = useState<Match>({} as Match);

  const { id } = useParams();
  const fetchData = useFetch();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const aggregateRounds = React.useCallback((rounds: Round[]) => {
    const findAggregatedRound = (rounds: AggregatedRound[], userId: number) => {
      return rounds.findIndex((r) => r.player.id === userId);
    };

    //Calculate the minimum and maximum sum of points amongs users
    const [minPointsAmongUsers, maxPointsAmongUsers] = rounds.reduce(
      (total, round) => {
        const [min, max] = total;
        const playsByUserId = rounds.filter((r) => r.userId === round.userId);
        const currentTotalPoints = calcTotalPoints(playsByUserId);

        const newMax = max >= currentTotalPoints ? max : currentTotalPoints;
        const newMin = min <= currentTotalPoints ? min : currentTotalPoints;
        return [newMin, newMax];
      },
      [1000, -1],
    );

    return rounds.reduce((acc, curr, _, totalRounds) => {
      const idx = findAggregatedRound(acc, curr.userId);
      if (idx === -1) {
        const playsByUserId = totalRounds.filter(
          (r) => r.userId === curr.userId,
        );
        const totalPoints = calcTotalPoints(playsByUserId);
        const status: StatusPlayer =
          totalPoints >= maxPointsAmongUsers
            ? 'losing'
            : totalPoints <= minPointsAmongUsers
            ? 'winning'
            : 'neutral';
        acc.push({
          player: curr.user,
          rounds: playsByUserId,
          status,
          totalPoints,
        });
      }
      return acc;
    }, [] as AggregatedRound[]);
  }, []);

  const calcTotalPoints = (rounds: Round[]) =>
    rounds.reduce((acc, r) => (acc += r.points), 0);

  useEffect(() => {
    if (!id) return;

    fetchRounds(id);

    fetchData<Match>(ApiEndpoint.getSingleMatch.replace(':id', id), 'GET').then(
      (data) => setCurrentMatch(data),
    );
  }, [id]);

  const fetchRounds = React.useCallback(
    async (id: string) => {
      try {
        setLoadingRounds(true);
        const data = await fetchData<Round[]>(
          ApiEndpoint.getRoundsByMatchId.replace(':matchId', id),
          'GET',
        );
        setAggregatedRounds(aggregateRounds(data));
        return Promise.resolve(data);
      } catch (e) {
        return Promise.reject(e);
      } finally {
        setLoadingRounds(false);
      }
    },
    [id],
  );

  return (
    <div className="flex flex-col gap-12 items-center align-middle mx-auto w-full px-6 max-w-7xl">
      <h1 className="mt-4 text-5xl md:text-6xl text-foreground font-bold">
        Dettaglio match {id}
      </h1>
      <div className="lg:max-w-[60%] w-full mx-auto flex flex-col gap-4">
        <div className="w-full flex justify-between gap-3">
          <Button
            variant="light"
            onPress={() => navigate(-1)}
            startContent={<span>⬅</span>}
          >
            Go back
          </Button>
          <Button
            color="primary"
            onPress={() => {
              onOpen();
            }}
            className={`${!currentMatch.inProgress && 'hidden'}`}
            endContent={<PlusIcon />}
          >
            {t('buttons.addRound')}
          </Button>
        </div>
        {isLoadingRounds ? (
          <Spinner label={t('loading')} />
        ) : aggregatedRounds.length > 0 ? (
          <RoundList
            getAllRounds={fetchRounds}
            listRounds={aggregatedRounds}
            currentMatch={currentMatch}
          />
        ) : (
          <h1 className="text-center text-2xl text-gray-700 dark:text-gray-400">
            {t('rounds.labels.noRoundsForThisMatch')}
          </h1>
        )}

        <CreateEditRoundDialog
          match={currentMatch}
          listRounds={aggregatedRounds}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          onCloseDialog={() => fetchRounds(id!)}
        />
      </div>
    </div>
  );
}

export default MatchDetailPage;
