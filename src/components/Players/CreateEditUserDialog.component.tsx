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
import { useState } from 'react';
import { Player } from '../../models/Player.ts';
import { ApiEndpoint } from '../../models/constants.ts';
import useFetch from '../../hooks/useFetch.tsx';
import { useToast } from '../../context/Toast.context.tsx';

interface ICreateEditUserProps {
  user?: Player;
  isOpen: boolean;
  onOpenChange: () => void;
  onCloseDialog: () => void;
}

function CreateEditUserDialogComponent({
  isOpen,
  onOpenChange,
  user,
  onCloseDialog,
}: ICreateEditUserProps) {
  const fetchData = useFetch();
  const [firstname, setFirstname] = useState(user?.firstname ?? '');
  const [lastname, setLastname] = useState(user?.lastname ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [password, setPassword] = useState(user?.password ?? '');
  const { showAlertMessage } = useToast();
  const handleSaveUser = () => {
    console.log({ user });
    const url = user ? ApiEndpoint.updateUser : ApiEndpoint.createUser;
    const method = user ? 'patch' : 'post';
    const successMessage = user
      ? `User ${user.username} saved successfully`
      : 'User created successfully';
    return fetchData(url, method, {
      body: JSON.stringify({ firstname, lastname, username, password }),
    }).then(() => {
      showAlertMessage({ message: successMessage, type: 'success' });
      onCloseDialog();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="auto"
      size="lg"
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
                  onChange={(e) => setFirstname(e.target.value)}
                />
                <Input
                  label="Lastname"
                  placeholder="Enter the lastname"
                  variant="bordered"
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
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
                label="Password"
                placeholder="Enter your password"
                type="password"
                variant="bordered"
                onChange={(e) => setPassword(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={async () => {
                  await handleSaveUser();
                  onClose();
                }}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateEditUserDialogComponent;
