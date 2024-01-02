import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import LockIcon from '../../icons/LockIcon.tsx';
import { TagUserLinearIcon } from '../../icons/TagUserIcon.tsx';
import React, { useEffect, useState } from 'react';
import { Player } from '../../models/Player.ts';
import { ApiEndpoint } from '../../models/constants.ts';
import useFetch from '../../hooks/useFetch.tsx';
import { useToast } from '../../context/Toast.context.tsx';
import { useTranslation } from 'react-i18next';

interface ICreateEditUserProps {
  user?: Player;
  isOpen: boolean;
  onOpenChange: () => void;
  onCloseDialog?: () => void;
}

function CreateEditUserDialogComponent({
  isOpen,
  user,
  onOpenChange,
  onCloseDialog,
}: ICreateEditUserProps) {
  const fetchData = useFetch();
  const { t } = useTranslation();
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { showAlertMessage } = useToast();
  const handleSaveUser = () => {
    const url = user
      ? ApiEndpoint.updateUser.replace(':id', user.id.toString())
      : ApiEndpoint.createUser;
    const method = user ? 'PATCH' : 'POST';
    const successMessage = user
      ? `User ${username} saved successfully`
      : 'User created successfully';
    const body = user
      ? { firstname, lastname, username }
      : { firstname, lastname, username, password };
    return fetchData(url, method, {
      body: JSON.stringify(body),
    }).then(() => {
      setFirstname('');
      setLastname('');
      setUsername('');
      setPassword('');
      showAlertMessage({ message: successMessage, type: 'success' });
    });
  };

  const isFormValid = React.useMemo<boolean>(
    () =>
      user
        ? Boolean(firstname && lastname && username)
        : Boolean(firstname && lastname && username && password),
    [firstname, lastname, username, password],
  );

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
      setUsername(user.username);
    }
  }, [user]);

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
              {user ? 'Edit user' : 'Create user'}
            </ModalHeader>
            <ModalBody>
              <div className="flex gap-1">
                <Input
                  autoFocus
                  label="Firstname"
                  placeholder="Enter the firstname"
                  variant="bordered"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <Input
                  label="Lastname"
                  placeholder="Enter the lastname"
                  variant="bordered"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </div>
              <Input
                endContent={
                  <TagUserLinearIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Username"
                placeholder="Enter your username"
                variant="bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                className={user ? 'hidden' : ''}
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
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
                {user ? t('buttons.save') : t('buttons.add')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateEditUserDialogComponent;
