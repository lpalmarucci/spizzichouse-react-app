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
import { Match } from '../../models/Match.ts';
import { Location } from '../../models/Location.ts';
import { Player } from '../../models/Player.ts';
import { useNavigate } from 'react-router-dom';

interface ICreateEditRoundProps {
  match?: Match;
  isOpen: boolean;
  onOpenChange: () => void;
  onCloseDialog?: () => void;
}

function CreateEditMatchDialog({
  isOpen,
  match,
  onOpenChange,
  onCloseDialog,
}: ICreateEditRoundProps) {
  const fetchData = useFetch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [areUsersLoading, setAreUsersLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Player[]>([]);
  const [areLocationLoading, setAreLocationLoading] = useState<boolean>(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Set<string>>(
    new Set(),
  );
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const { showAlertMessage } = useToast();
  const handleSaveMatch = () => {
    const url = match
      ? ApiEndpoint.updateMatch.replace(':id', match.id.toString())
      : ApiEndpoint.createMatch;
    // const method = round ? 'PATCH' : 'POST';
    const successMessage = match
      ? 'Match saved successfully'
      : 'Match created successfully';

    const locationId = selectedLocation
      ? Number(Array.from(selectedLocation.values()).at(0))
      : null;
    const userIds = Array.from(selectedUsers.values()).map((userId) =>
      Number(userId),
    );
    const body = JSON.stringify({
      locationId,
      totalPoints,
      userIds,
      inProgress: true,
    });
    const method = match ? 'PATCH' : 'POST';

    return fetchData<Match>(url, method, { body }).then((data) => {
      setTotalPoints(0);
      setSelectedLocation(new Set());
      setSelectedUsers(new Set());
      showAlertMessage({ message: successMessage, type: 'success' });
      navigate(`/matches/${data.id}`);
    });
  };

  const isFormValid = React.useMemo<boolean>(
    () =>
      Boolean(
        totalPoints > 0 && selectedUsers.size > 0 && selectedLocation.size > 0,
      ),
    [selectedUsers, totalPoints, selectedLocation],
  );

  useEffect(() => {
    fetchData<Player[]>(ApiEndpoint.getUsers, 'GET')
      .then((data) => setUsers(data))
      .finally(() => setAreUsersLoading(false));

    fetchData<Location[]>(ApiEndpoint.getLocations, 'GET')
      .then((data) => setLocations(data))
      .finally(() => setAreLocationLoading(false));
  }, []);

  useEffect(() => {
    if (match) {
      console.log({ match });
      setSelectedLocation(new Set(match.location?.id.toString() ?? '-1'));
      setSelectedUsers(new Set(match.users.map((user) => user.id.toString())));
      setTotalPoints(match.totalPoints);
    }
  }, [match]);

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
              {match ? 'Edit match' : 'Create match'}
            </ModalHeader>
            <ModalBody>
              <Select
                autoFocus
                label={'Users'}
                placeholder="Select the users"
                selectionMode="multiple"
                variant="bordered"
                isRequired={true}
                isDisabled={!!match}
                isLoading={areUsersLoading}
                selectedKeys={selectedUsers}
                onSelectionChange={(keys: Selection) =>
                  setSelectedUsers(keys as Set<string>)
                }
              >
                {users.map((user) => (
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
                  label="Total points"
                  placeholder="Enter the maximun points to reach"
                  variant="bordered"
                  isRequired={true}
                  value={totalPoints.toString()}
                  onChange={(e) => setTotalPoints(Number(e.target.value))}
                />

                <Select
                  isLoading={areLocationLoading}
                  label={'Location'}
                  placeholder="Select the location"
                  variant="bordered"
                  isRequired={true}
                  selectedKeys={selectedLocation}
                  onSelectionChange={(keys: Selection) =>
                    setSelectedLocation(keys as Set<string>)
                  }
                >
                  {locations.map((location) => (
                    <SelectItem
                      key={location.id}
                      value={location.id}
                      textValue={location.name}
                    >
                      {location.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await handleSaveMatch();
                  if (onCloseDialog) onCloseDialog();
                  onClose();
                }}
                isDisabled={!isFormValid}
              >
                {match ? t('buttons.save') : t('buttons.add')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateEditMatchDialog;
