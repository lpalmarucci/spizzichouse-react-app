import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { Player } from '../../models/Player.ts';
import { ApiEndpoint } from '../../models/constants.ts';
import useFetch from '../../hooks/useFetch.tsx';
import { useToast } from '../../context/Toast.context.tsx';
import { useTranslation } from 'react-i18next';

interface ICreateEditLocationProps {
  user?: Player;
  isOpen: boolean;
  onOpenChange: () => void;
  onCloseDialog?: () => void;
}

function CreateEditLocationDialog({
  isOpen,
  user,
  onOpenChange,
  onCloseDialog,
}: ICreateEditLocationProps) {
  const { t } = useTranslation();
  const { showAlertMessage } = useToast();
  const fetchData = useFetch();
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Player[]>([]);
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleSaveUser = () => {
    const url = user
      ? ApiEndpoint.updateUser.replace(':id', user.id.toString())
      : ApiEndpoint.createUser;
    const method = user ? 'PATCH' : 'POST';
    const successMessage = user
      ? `Location ${username} saved successfully`
      : 'Location created successfully';
    const body = user
      ? { name, address, username }
      : { name, address, username, password };
    return fetchData(url, method, {
      body: JSON.stringify(body),
    }).then(() => {
      setName('');
      setAddress('');
      setUsername('');
      setPassword('');
      showAlertMessage({ message: successMessage, type: 'success' });
    });
  };

  const isFormValid = React.useMemo<boolean>(
    () =>
      user
        ? Boolean(name && address && username)
        : Boolean(name && address && username && password),
    [name, address, username, password],
  );

  useEffect(() => {
    fetchData<Player[]>(ApiEndpoint.getUsers, 'GET')
      .then((data) => setUsers(data))
      .finally(() => setIsUsersLoading(false));
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.firstname);
      setAddress(user.lastname);
      setUsername(user.username);
    }
  }, [user]);

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
              {user ? 'Edit user' : 'Create user'}
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
              >
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                  </SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await handleSaveUser();
                  if (onCloseDialog) onCloseDialog();
                  onClose();
                }}
                isDisabled={!isFormValid}
              >
                {user ? 'Save' : 'Add'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateEditLocationDialog;
