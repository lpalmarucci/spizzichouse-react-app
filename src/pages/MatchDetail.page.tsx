import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.tsx';
import { Round } from '../models/Round.ts';
import { ApiEndpoint } from '../models/constants.ts';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
} from '@nextui-org/react';
import { Player } from '../models/Player.ts';
import { getInitialLetters } from '../shared/utils.tsx';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { useTranslation } from 'react-i18next';

type AggregatedRound = {
  player: Player;
  rounds: Round[];
};

function MatchDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const fetchData = useFetch();
  const [aggregatedRounds, setAggregatedRounds] = useState<AggregatedRound[]>(
    [],
  );

  const aggregateRounds = React.useCallback((rounds: Round[]) => {
    const findAggregatedRound = (rounds: AggregatedRound[], userId: number) => {
      return rounds.findIndex((r) => r.player.id === userId);
    };

    return rounds.reduce((acc, curr, _, totalRounds) => {
      const idx = findAggregatedRound(acc, curr.userId);
      if (idx === -1) {
        const playsByRoundsId = totalRounds.filter(
          (r) => r.userId === curr.userId,
        );
        acc.push({ player: curr.user, rounds: playsByRoundsId });
      }
      return acc;
    }, [] as AggregatedRound[]);
  }, []);

  const calcTotalPoints = (rounds: Round[]) =>
    rounds.reduce((acc, r) => (acc += r.points), 0);

  useEffect(() => {
    if (!id) return;

    fetchData<Round[]>(
      ApiEndpoint.getRoundsByMatchId.replace(':matchId', id),
      'GET',
    ).then((data) => {
      setAggregatedRounds(aggregateRounds(data));
    });
  }, [id]);

  console.log({ rounds: aggregatedRounds });

  return (
    <div className="flex flex-col gap-12 items-center align-middle mx-auto w-full px-6 max-w-7xl">
      <h1 className="mt-4 text-5xl md:text-6xl text-foreground font-bold">
        Dettaglio match {id}
      </h1>
      <div className="lg:max-w-[60%] w-full mx-auto flex flex-col gap-4">
        <div className="flex justify-end gap-3">
          <Button
            color="primary"
            onPress={() => {
              // setCurrentLocation(undefined);
              // onOpen();
            }}
            endContent={<PlusIcon />}
          >
            {t('buttons.addRound')}
          </Button>
        </div>
        <Accordion variant="shadow" className="w-full">
          {aggregatedRounds.map(({ player, rounds }) => (
            <AccordionItem
              key={player.id}
              aria-label={`${player.firstname} ${player.lastname}`}
              startContent={
                <Avatar
                  isBordered
                  color="primary"
                  radius="lg"
                  name={getInitialLetters(player.firstname, player.lastname)}
                />
              }
              subtitle={`${rounds.length} rounds already played`}
              title={
                <div className="w-full flex justify-between items-center relative">
                  <span>{`${player.firstname} ${player.lastname}`}</span>
                  <span className="absolute top-1/3 right-0 text-green-600">
                    {calcTotalPoints(rounds)}
                  </span>
                </div>
              }
            >
              <div className="p-8">
                {rounds.map((r) => (
                  <Card
                    key={`${r.matchId}-${r.userId}-${r.roundId}`}
                    isPressable={false}
                    shadow="md"
                    className="w-[84px]"
                  >
                    <CardBody className="overflow-visible p-0">
                      <div className="h-[64px] w-full bg-gradient-to-br from-gray-600 to-gray-400 relative">
                        <span className="select-none absolute text-5xl font-extrabold text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          R{r.roundId}
                        </span>
                      </div>
                    </CardBody>
                    <CardFooter className="text-small justify-between">
                      <b>Punti</b>
                      <p className="text-default-500">{r.points}</p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

export default MatchDetailPage;
