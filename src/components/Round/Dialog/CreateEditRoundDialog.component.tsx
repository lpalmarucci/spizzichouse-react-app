import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Selection,
  SelectItem,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import useFetch from '../../../hooks/useFetch.tsx';
import { useToast } from '../../../context/Toast.context.tsx';
import { useTranslation } from 'react-i18next';
import { AggregatedRound, Round } from '../../../models/Round.ts';
import { Match } from '../../../models/Match.ts';
import ApiEndpoints from '../../../costants/ApiEndpoints.ts';

interface ICreateEditRoundProps {
  round?: Round;
  listRounds: AggregatedRound[];
  match: Match;
  isOpen: boolean;
  onOpenChange: () => void;
  onCloseDialog?: () => void;
}

function CreateEditRoundDialog({
  isOpen,
  round,
  listRounds,
  match,
  onOpenChange,
  onCloseDialog,
}: ICreateEditRoundProps) {
  const fetchData = useFetch();
  const { t } = useTranslation();
  const [points, setPoints] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<Set<string>>(new Set());

  const roundNumber = React.useMemo<number>(() => {
    if (round) return round.roundId;
    if (selectedUser.size === 0) return 1;

    const userId = Number(Array.from(selectedUser.values()).at(0));
    const userRounds = listRounds.find((r) => r.player.id === userId);
    if (!userRounds) return 1;
    return userRounds.rounds[userRounds.rounds.length - 1].roundId + 1;
  }, [listRounds, selectedUser]);

  const { showAlertMessage } = useToast();
  const handleSaveRound = () => {
    const url = ApiEndpoints.createRound
      .replace(':matchId', match.id.toString())
      .replace(':roundId', roundNumber.toString());
    // const method = round ? 'PATCH' : 'POST';
    const successMessage = round
      ? t('rounds.messages.updateSuccess')
      : t('rounds.messages.creationSuccess');
    const body = JSON.stringify({ points });
    const method = round ? 'PATCH' : 'POST';

    const promises = Array.from(selectedUser.values()).map((userId) =>
      fetchData<Round>(url.replace(':userId', userId.toString()), method, {
        body,
      }),
    );

    return Promise.all(promises).then(() => {
      clearAllFields();
      showAlertMessage({ message: successMessage, type: 'success' });
    });
  };

  function clearAllFields() {
    setPoints(0);
    setSelectedUser(new Set());
  }

  const isFormValid = React.useMemo<boolean>(
    () => Boolean(match.id && selectedUser && points >= 0 && roundNumber > 0),
    [match, selectedUser, points, roundNumber],
  );

  useEffect(() => {
    if (round) {
      setSelectedUser(new Set([round.user.id.toString()]));
      setPoints(round.points);
    }
  }, [round]);

  return (
    <Modal
      isOpen={isOpen}
      placement="auto"
      size="xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 ">
              {round
                ? t('rounds.labels.editRound').replace(
                    '{id}',
                    round.roundId.toString(),
                  )
                : t('rounds.labels.createRound')}
            </ModalHeader>
            <ModalBody>
              <Select
                autoFocus
                label={t('labels.players')}
                placeholder={t('placeholders.selectUsers')}
                variant="bordered"
                isRequired={true}
                selectedKeys={selectedUser}
                onSelectionChange={(keys: Selection) =>
                  setSelectedUser(keys as Set<string>)
                }
                isDisabled={Boolean(round)}
              >
                {match.users.map((user) => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    textValue={user.username}
                  >
                    {user.firstname} {user.lastname}
                  </SelectItem>
                ))}
              </Select>
              <div className="flex gap-1">
                <Input
                  type="number"
                  min={0}
                  label={t('matches.labels.roundNumber')}
                  placeholder={t('placeholders.enterRoundNumber')}
                  variant="bordered"
                  isRequired={true}
                  isDisabled={true}
                  value={roundNumber.toString()}
                />
                <Input
                  type="number"
                  min={0}
                  label={t('matches.labels.points')}
                  placeholder={t('placeholders.enterPointsScored')}
                  variant="bordered"
                  isRequired={true}
                  value={points.toString()}
                  onChange={(e) => setPoints(Number(e.target.value))}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await handleSaveRound();
                  if (onCloseDialog) onCloseDialog();
                  clearAllFields();
                  onClose();
                }}
                isDisabled={!isFormValid}
              >
                {round ? t('buttons.save') : t('buttons.add')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateEditRoundDialog;
