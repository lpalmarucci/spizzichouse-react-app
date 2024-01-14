import { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Avatar,
  useDisclosure,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { Match } from '../../models/Match.ts';
import { AggregatedRound, Round } from '../../models/Round.ts';
import AlertDialog from '../AlertDialog.component.tsx';
import { ApiEndpoint } from '../../models/constants.ts';
import { useToast } from '../../context/Toast.context.tsx';
import useFetch from '../../hooks/useFetch.tsx';
import CreateEditRoundDialog from './Dialog/CreateEditRoundDialog.component.tsx';
import RoundCard from './RoundCard.component.tsx';
import { getInitialLetters } from '../../shared/utils.tsx';

interface IRoundListProps {
  listRounds: AggregatedRound[];
  currentMatch: Match;
  getAllRounds: (id: string) => Promise<Round[]>;
}

function RoundList({
  listRounds,
  currentMatch,
  getAllRounds,
}: IRoundListProps) {
  const [currentRound, setCurrentRound] = useState<Round | undefined>();

  const {
    isOpen: isOpenEditRoundDialog,
    onOpen: onOpenEditRoundDialog,
    onOpenChange: onOpenChangeEditRoundDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenAlertDialog,
    onOpen: onOpenAlertDialog,
    onOpenChange: onOpenChangeAlertDialog,
  } = useDisclosure();
  const { t } = useTranslation();

  const { showAlertMessage } = useToast();
  const fetchData = useFetch();
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
      getAllRounds(currentRound.matchId.toString());
      setCurrentRound(undefined);
    });
  }

  return (
    <>
      <Accordion variant="shadow" className="w-full">
        {listRounds.map((aggregatedRound) => (
          <AccordionItem
            key={aggregatedRound.player.id}
            aria-labelledby={`List of rounds for user ${aggregatedRound.player.id}`}
            aria-label={`${aggregatedRound.player.firstname} ${aggregatedRound.player.lastname}`}
            classNames={{
              title:
                aggregatedRound.status === 'winning'
                  ? 'text-success'
                  : aggregatedRound.status === 'losing'
                  ? 'text-danger'
                  : 'text-primary',
            }}
            startContent={
              <Avatar
                isBordered
                color={
                  aggregatedRound.status === 'winning'
                    ? 'success'
                    : aggregatedRound.status === 'losing'
                    ? 'danger'
                    : 'primary'
                }
                radius="lg"
                name={getInitialLetters(
                  aggregatedRound.player.firstname,
                  aggregatedRound.player.lastname,
                )}
              />
            }
            subtitle={t('rounds.labels.numRoundsPlayed').replace(
              '{number}',
              aggregatedRound.rounds.length.toString(),
            )}
            title={
              <div className="w-full flex justify-between items-center relative">
                <span>{`${aggregatedRound.player.firstname} ${aggregatedRound.player.lastname}`}</span>
                <span className="absolute top-1/3 right-0">
                  {aggregatedRound.totalPoints}
                </span>
              </div>
            }
          >
            <RoundCard
              key={aggregatedRound.player.id}
              aggregatedRound={aggregatedRound}
              currentMatch={currentMatch}
              setSelectedRound={setCurrentRound}
              onOpenEditRoundDialog={onOpenEditRoundDialog}
              onOpenAlertDialog={onOpenAlertDialog}
            />
          </AccordionItem>
        ))}
      </Accordion>
      <CreateEditRoundDialog
        match={currentMatch}
        round={currentRound}
        listRounds={listRounds}
        isOpen={isOpenEditRoundDialog}
        onOpenChange={onOpenChangeEditRoundDialog}
        onCloseDialog={() => getAllRounds(currentMatch.id.toString())}
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
    </>
  );
}

export default RoundList;
