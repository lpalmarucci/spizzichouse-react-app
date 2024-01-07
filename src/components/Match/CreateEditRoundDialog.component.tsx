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
import { ApiEndpoint } from '../../models/constants.ts';
import useFetch from '../../hooks/useFetch.tsx';
import { useToast } from '../../context/Toast.context.tsx';
import { useTranslation } from 'react-i18next';
import { Round } from '../../models/Round.ts';
import { Match } from '../../models/Match.ts';

interface ICreateEditRoundProps {
  round?: Round;
  match: Match;
  isOpen: boolean;
  onOpenChange: () => void;
  onCloseDialog?: () => void;
}

function CreateEditRoundDialog({
  isOpen,
  round,
  match,
  onOpenChange,
  onCloseDialog,
}: ICreateEditRoundProps) {
  const fetchData = useFetch();
  const { t } = useTranslation();
  const [points, setPoints] = useState<number>(0);
  const [roundId, setRoundId] = useState<number>(0);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const { showAlertMessage } = useToast();
  const handleSaveRound = () => {
    const url = ApiEndpoint.createRound
      .replace(':matchId', match.id.toString())
      .replace(':roundId', roundId.toString());
    // const method = round ? 'PATCH' : 'POST';
    const successMessage = round
      ? 'Round saved successfully'
      : 'Round created successfully';
    const body = JSON.stringify({ points });
    const method = round ? 'PATCH' : 'POST';

    const promises = Array.from(selectedUsers.values()).map((userId) =>
      fetchData<Round>(url.replace(':userId', userId.toString()), method, {
        body,
      }),
    );

    return Promise.all(promises).then(() => {
      setPoints(0);
      setRoundId(0);
      setSelectedUsers(new Set());
      showAlertMessage({ message: successMessage, type: 'success' });
    });
  };

  const isFormValid = React.useMemo<boolean>(
    () => Boolean(match.id && selectedUsers && points >= 0 && roundId),
    [match, selectedUsers, points, roundId],
  );

  useEffect(() => {
    if (round) {
      setRoundId(round.roundId);
      setSelectedUsers(new Set([round.user.id.toString()]));
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
              {round ? 'Edit round' : 'Create round'}
            </ModalHeader>
            <ModalBody>
              <Select
                autoFocus
                label={'Users'}
                placeholder="Select the users"
                selectionMode="multiple"
                variant="bordered"
                isRequired={true}
                selectedKeys={selectedUsers}
                onSelectionChange={(keys: Selection) =>
                  setSelectedUsers(keys as Set<string>)
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
                  label="Round number"
                  placeholder="Enter the round number"
                  variant="bordered"
                  isRequired={true}
                  isDisabled={Boolean(round)}
                  value={roundId.toString()}
                  onChange={(e) => setRoundId(Number(e.target.value))}
                />
                <Input
                  type="number"
                  min={0}
                  label="Points"
                  placeholder="Enter the points scored in this round"
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
