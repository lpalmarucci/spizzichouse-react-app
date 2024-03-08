import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { User } from '@nextui-org/react';
import { getInitialLetters } from '../shared/utils.tsx';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { ROUTES } from '../routes/common.routes.tsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExitIcon from '../icons/ExitIcon.tsx';
import LockIcon from '../icons/LockIcon.tsx';
import CustomDrawer from './ui/Drawer.component.tsx';
import {
  DialogProvider,
  useDialogContext,
} from '../context/Dialog.context.tsx';
import ChangePasswordForm from './auth/ChangePassword/ChangePasswordForm.component.tsx';

const UserMenu = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const userData = useAuthUser()();
  const { isDialogOpen, openDialog, closeDialog } = useDialogContext<any>();
  function handleLogout() {
    localStorage.clear();
    if (signOut()) {
      navigate(ROUTES.Login);
    }
  }

  return (
    <>
      <Dropdown placement="bottom-end" showArrow>
        <DropdownTrigger className=" md:flex">
          <User
            name={`${userData?.firstname} ${userData?.lastname}`}
            description={`@${userData?.username}`}
            className="cursor-pointer "
            classNames={{
              name: 'hidden md:block',
              description: 'hidden md:block',
            }}
            avatarProps={{
              name: getInitialLetters(userData?.firstname, userData?.lastname),
            }}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions">
          <DropdownSection title="Profile">
            <DropdownItem
              key="change-password"
              classNames={{
                title: 'flex gap-2 items-center',
              }}
              onClick={() => {
                openDialog();
              }}
            >
              <LockIcon />
              Change password
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              className="text-danger"
              classNames={{
                title: 'flex gap-2 items-center',
              }}
              onClick={handleLogout}
            >
              <ExitIcon />
              {t('buttons.logout')}
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <CustomDrawer
        isOpen={isDialogOpen}
        onOpenChange={(isOpen) => !isOpen && closeDialog()}
      >
        <ChangePasswordForm />
      </CustomDrawer>
    </>
  );
};

const UserMenuWrapper = () => (
  <DialogProvider>
    <UserMenu />
  </DialogProvider>
);

export default UserMenuWrapper;
