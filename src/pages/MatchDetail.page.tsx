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

const roundTableColumns = [
  { name: 'Round number', uid: 'roundId' },
  { name: 'Points', uid: 'points' },
  { name: 'Actions', uid: 'actions' },
];

function MatchDetailPage() {
  const [aggregatedRounds, setAggregatedRounds] = useState<AggregatedRound[]>(
    [],
  );
  const [currentMatch, setCurrentMatch] = useState<Match>({} as Match);
  const [currentRound, setCurrentRound] = useState<Round | undefined>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAlertDialog,
    onOpen: onOpenAlertDialog,
    onOpenChange: onOpenChangeAlertDialog,
  } = useDisclosure();
  const { showAlertMessage } = useToast();
  const { id } = useParams();
  const { t } = useTranslation();
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
    (id: string) =>
      fetchData<Round[]>(
        ApiEndpoint.getRoundsByMatchId.replace(':matchId', id),
        'GET',
      ).then((data) => {
        setAggregatedRounds(aggregateRounds(data));
      }),
    [id],
  );

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
        message: 'Round deleted successfully',
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
            endContent={<PlusIcon />}
          >
            {t('buttons.addRound')}
          </Button>
        </div>
        {aggregatedRounds.length > 0 ? (
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
                    <span className="absolute top-1/3 right-0 text-primary-400">
                      {calcTotalPoints(rounds)}
                    </span>
                  </div>
                }
              >
                <div className="flex gap-5 p-8 pt-2">
                  {rounds.length > 0 ? (
                    <Table color="primary">
                      <TableHeader columns={roundTableColumns}>
                        {(column) => (
                          <TableColumn key={column.uid}>
                            {column.name}
                          </TableColumn>
                        )}
                      </TableHeader>
                      <TableBody
                        emptyContent={t('emptyContent.Locations')}
                        items={rounds}
                        loadingContent={<Spinner label={t('loading')} />}
                      >
                        {(r) => (
                          <TableRow
                            key={`${r.roundId}-${r.userId}-${r.matchId}`}
                          >
                            {(columnKey) => (
                              <TableCell>{renderCell(r, columnKey)}</TableCell>
                            )}
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  ) : (
                    <h1 className="text-center text-xl text-foreground">
                      No rounds found
                    </h1>
                  )}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <h1 className="text-center text-2xl text-gray-700 dark:text-gray-400">
            No rounds found for this match. Create a new one now!
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
            {`Are you sure you want to delete round #${currentRound?.roundId} for the user ${currentRound?.user.username}?`}
          </div>
        }
      />
    </div>
  );
}

export default MatchDetailPage;
