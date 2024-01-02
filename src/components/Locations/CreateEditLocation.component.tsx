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
import { Player } from '../../models/Player.ts';
import { ApiEndpoint } from '../../models/constants.ts';
import useFetch from '../../hooks/useFetch.tsx';
import { useToast } from '../../context/Toast.context.tsx';
import { useTranslation } from 'react-i18next';
import { Location } from '../../models/Location.ts';

interface ICreateEditLocationProps {
  location?: Location;
  isOpen: boolean;
  onOpenChange: () => void;
  onCloseDialog?: () => void;
}

function CreateEditLocationDialog({
  isOpen,
  location,
  onOpenChange,
  onCloseDialog,
}: ICreateEditLocationProps) {
  const { t } = useTranslation();
  const { showAlertMessage } = useToast();
  const fetchData = useFetch();
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Player[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const handleSaveLocation = () => {
    const url = location
      ? ApiEndpoint.updateLocation.replace(':id', location.id.toString())
      : ApiEndpoint.createLocation;
    const method = location ? 'PATCH' : 'POST';
    const successMessage = location
      ? t('locations.messages.updateSuccess').replace('{name}', location.name)
      : t('locations.messages.creationSuccess');
    const body = {
      name,
      address,
      userIds: Array.from(selectedUsers.values()).map((id) => Number(id)),
    };
    return fetchData(url, method, {
      body: JSON.stringify(body),
    }).then(() => {
      setName('');
      setAddress('');
      setSelectedUsers(new Set());
      showAlertMessage({ message: successMessage, type: 'success' });
    });
  };

  const isFormValid = React.useMemo<boolean>(
    () =>
      location ? Boolean(name && address) : Boolean(name && address && users),
    [name, address, users],
  );

  useEffect(() => {
    fetchData<Player[]>(ApiEndpoint.getUsers, 'GET')
      .then((data) => setUsers(data))
      .finally(() => setIsUsersLoading(false));
  }, []);

  useEffect(() => {
    if (location) {
      setName(location.name);
      setAddress(location.address);
      setSelectedUsers(new Set(location.users.map((u) => u.id.toString())));
    }
  }, [location]);

  return (
    <Modal
      isOpen={isOpen}
      placement="auto"
      size="lg"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 ">
              {location ? 'Edit location' : 'Create location'}
            </ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label={t('labels.name')}
                placeholder="Enter the name"
                variant="bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label={t('labels.address')}
                placeholder="Enter the address"
                variant="bordered"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <Select
                isLoading={isUsersLoading}
                label={t('labels.associatedUsers')}
                placeholder="Select the users"
                selectionMode="multiple"
                variant="bordered"
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await handleSaveLocation();
                  if (onCloseDialog) onCloseDialog();
                  onClose();
                }}
                isDisabled={!isFormValid}
              >
                {location ? t('buttons.save') : t('buttons.add')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateEditLocationDialog;
