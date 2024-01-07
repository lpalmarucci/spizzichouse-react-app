import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.tsx';
import { Round } from '../models/Round.ts';
import { ApiEndpoint } from '../models/constants.ts';
import {
  Accordion,
  AccordionItem,
  Avatar,
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { Player } from '../models/Player.ts';
import { getInitialLetters } from '../shared/utils.tsx';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { useTranslation } from 'react-i18next';
import { Match } from '../models/Match.ts';
import CreateEditRoundDialog from '../components/Match/CreateEditRoundDialog.component.tsx';
import EditIcon from '../icons/EditIcon.tsx';
import { DeleteIcon } from '../icons/DeleteIcon.tsx';
import AlertDialog from '../components/AlertDialog.component.tsx';
import { useToast } from '../context/Toast.context.tsx';

type AggregatedRound = {
  player: Player;
  rounds: Round[];
};

function MatchDetailPage() {
  const { t } = useTranslation();
  const [isLoadingRounds, setLoadingRounds] = useState<boolean>(true);
  const [aggregatedRounds, setAggregatedRounds] = useState<AggregatedRound[]>(
    [],
  );
  const [currentMatch, setCurrentMatch] = useState<Match>({} as Match);
  const [currentRound, setCurrentRound] = useState<Round | undefined>();

  const roundTableColumns = React.useMemo(
    () => [
      { name: t('matches.labels.roundNumber'), uid: 'roundId' },
      { name: t('matches.labels.points'), uid: 'points' },
      { name: t('matches.labels.actions'), uid: 'actions' },
    ],
    [],
  );

  const filteredRoundTableColumns = React.useMemo(() => {
    if (currentMatch.inProgress) return roundTableColumns;
    return roundTableColumns.filter((c) => c.uid !== 'actions');
  }, [currentMatch]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAlertDialog,
    onOpen: onOpenAlertDialog,
    onOpenChange: onOpenChangeAlertDialog,
  } = useDisclosure();
  const { showAlertMessage } = useToast();
  const { id } = useParams();
  const fetchData = useFetch();
  const navigate = useNavigate();

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

  const usersWinning = React.useMemo(() => {
    if (aggregatedRounds.length === 0) return [];
    return aggregatedRounds.reduce(
      (users, currentRound) => {
        if (users.map((u) => u.id).includes(currentRound.player.id))
          return users;
        const minPoints = users[0].points;
        const currentRoundTotalPoints = calcTotalPoints(currentRound.rounds);
        const objCurrUser = {
          id: currentRound.player.id,
          points: currentRoundTotalPoints,
        };
        return currentRoundTotalPoints < minPoints
          ? [objCurrUser]
          : currentRoundTotalPoints === minPoints
          ? [...users, objCurrUser]
          : users;
      },
      [
        {
          id: aggregatedRounds[0].player.id,
          points: calcTotalPoints(aggregatedRounds[0].rounds),
        },
      ] as {
        id: number;
        points: number;
      }[],
    );
  }, [aggregatedRounds]);

  const usersAtRisk = React.useMemo(() => {
    if (aggregatedRounds.length === 0) return [];
    return aggregatedRounds.reduce(
      (users, currentRound) => {
        if (users.map((u) => u.id).includes(currentRound.player.id))
          return users;
        const maxPoints = users[0].points;
        const currentRoundTotalPoints = calcTotalPoints(currentRound.rounds);
        const objCurrUser = {
          id: currentRound.player.id,
          points: currentRoundTotalPoints,
        };
        return currentRoundTotalPoints > maxPoints
          ? [objCurrUser]
          : currentRoundTotalPoints === maxPoints
          ? [...users, objCurrUser]
          : users;
      },
      [
        {
          id: aggregatedRounds[0].player.id,
          points: calcTotalPoints(aggregatedRounds[0].rounds),
        },
      ] as {
        id: number;
        points: number;
      }[],
    );
  }, [aggregatedRounds]);

  useEffect(() => {
    if (!id) return;

    fetchRounds(id);

    fetchData<Match>(ApiEndpoint.getSingleMatch.replace(':id', id), 'GET').then(
      (data) => setCurrentMatch(data),
    );
  }, [id]);

  async function handleDeleteRound() {
    if (!currentRound) {
      return;
    }
    const { matchId, userId, roundId } = currentRound;
    const url = ApiEndpoint.deleteRound
      .replace(':matchId', matchId.toString())
      .replace(':userId', userId.toString())
      .replace(':roundId', roundId.toString());
    return fetchData<Round>(url, 'DELETE').then(() => {
      showAlertMessage({
        message: t('rounds.messages.deleteSuccess'),
        type: 'success',
      });
      fetchRounds(currentRound.matchId.toString());
      setCurrentRound(undefined);
    });
  }

  const renderCell = React.useCallback((round: Round, columnKey: React.Key) => {
    const cellValue = round[columnKey as keyof Round];

    switch (columnKey) {
      case 'actions':
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip content={'Edit round'} closeDelay={0}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon
                  onClick={() => {
                    setCurrentRound(round);
                    onOpen();
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={'Delete round'} closeDelay={0}>
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon
                  onClick={() => {
                    setCurrentRound(round);
                    onOpenAlertDialog();
                  }}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return <span>{cellValue.toString()}</span>;
    }
  }, []);

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
          <Accordion variant="shadow" className="w-full">
            {aggregatedRounds.map(({ player, rounds }) => (
              <AccordionItem
                key={player.id}
                aria-label={`${player.firstname} ${player.lastname}`}
                classNames={{
                  title: usersAtRisk.find((u) => u.id === player.id)
                    ? 'text-danger'
                    : usersWinning.find((u) => u.id === player.id)
                    ? 'text-success'
                    : 'text-primary',
                }}
                startContent={
                  <Avatar
                    isBordered
                    color={
                      usersAtRisk.find((u) => u.id === player.id)
                        ? 'danger'
                        : usersWinning.find((u) => u.id === player.id)
                        ? 'success'
                        : 'primary'
                    }
                    radius="lg"
                    name={getInitialLetters(player.firstname, player.lastname)}
                  />
                }
                subtitle={t('rounds.labels.numRoundsPlayed').replace(
                  '{number}',
                  rounds.length.toString(),
                )}
                title={
                  <div className="w-full flex justify-between items-center relative">
                    <span>{`${player.firstname} ${player.lastname}`}</span>
                    <span className="absolute top-1/3 right-0">
                      {calcTotalPoints(rounds)}
                    </span>
                  </div>
                }
              >
                <div className="flex gap-5 p-8 pt-2">
                  <Table color="primary">
                    <TableHeader columns={filteredRoundTableColumns}>
                      {(column) => (
                        <TableColumn key={column.uid}>
                          {column.name}
                        </TableColumn>
                      )}
                    </TableHeader>
                    <TableBody
                      emptyContent={t('emptyContent.Locations')}
                      items={rounds}
                    >
                      {(r) => (
                        <TableRow key={`${r.roundId}-${r.userId}-${r.matchId}`}>
                          {(columnKey) => (
                            <TableCell>{renderCell(r, columnKey)}</TableCell>
                          )}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <h1 className="text-center text-2xl text-gray-700 dark:text-gray-400">
            {t('rounds.labels.noRoundsForThisMatch')}
          </h1>
        )}
      </div>
      <CreateEditRoundDialog
        match={currentMatch}
        round={currentRound}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCloseDialog={() => fetchRounds(id!)}
      />
      <AlertDialog
        isOpen={isOpenAlertDialog}
        onOpenChange={onOpenChangeAlertDialog}
        onConfirm={handleDeleteRound}
        contentText={
          <div className="flex gap-1">
            {t('rounds.messages.askDelete')
              .replace('{id}', currentRound?.roundId.toString() ?? '')
              .replace('{username}', currentRound?.user.username ?? '')}
          </div>
        }
      />
    </div>
  );
}

export default MatchDetailPage;
