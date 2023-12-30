import React, { useState } from 'react';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Switch,
  Tab,
  Tabs,
  User,
} from '@nextui-org/react';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/dropdown';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../routes/common.routes';
import { useNavigate } from 'react-router-dom';
import { useAuthUser, useSignOut } from 'react-auth-kit';
import { getInitialLetters } from '../shared/utils';
import { useTheme } from '../context/Theme.context.tsx';
import { SunIcon } from '../icons/SunIcon.tsx';
import { MoonIcon } from '../icons/MoonIcon.tsx';

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const signOut = useSignOut();
  const userData = useAuthUser()();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [selectedKey, setSelectedKey] = useState<string>(
    window.location.pathname,
  );

  //If i don't have the user data, it means that i'm not logged in anymore
  if (!userData) {
    navigate(ROUTES.Login);
    return;
  }

  function handleLogout() {
    if (signOut()) {
      navigate(ROUTES.Login);
    }
  }

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      classNames={{
        wrapper: 'max-w-7xl',
      }}
      className="mb-0 sm:mb-10"
    >
      <NavbarContent className="md:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={() => {
            setSelectedKey(ROUTES.Dashboard);
            navigate(ROUTES.Dashboard);
          }}
        >
          {t('appName').toUpperCase()}
        </p>
      </NavbarBrand>

      <NavbarContent className="hidden md:flex gap-4" justify="center">
        <Tabs
          variant="light"
          size="lg"
          selectedKey={selectedKey}
          onSelectionChange={(key) => {
            setSelectedKey(key.toString());
            navigate(key.toString());
          }}
        >
          <Tab key={ROUTES.Dashboard} title={t('menu.dashboard')} />
          <Tab key={ROUTES.Players} title={t('menu.players')} />
        </Tabs>
      </NavbarContent>

      <NavbarContent
        as="div"
        className=" gap-0 md: gap-3 lg:gap-10"
        justify="end"
      >
        <Dropdown placement="bottom-end" showArrow>
          <DropdownTrigger className="hidden md:flex">
            <User
              name={`${userData?.firstname} ${userData?.lastname}`}
              description={`@${userData?.username}`}
              className="cursor-pointer"
              avatarProps={{
                name: getInitialLetters(
                  userData?.firstname,
                  userData?.lastname,
                ),
              }}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions">
            <DropdownSection title="Actions">
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                onClick={handleLogout}
              >
                {t('buttons.logout')}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
        <Switch
          size="md"
          color="primary"
          isSelected={theme === 'dark'}
          onChange={() => toggleTheme()}
          startContent={<SunIcon />}
          endContent={<MoonIcon />}
        ></Switch>
      </NavbarContent>
      <NavbarMenu>
        {Object.entries(ROUTES).map(([key, value]) => (
          <NavbarMenuItem key={value}>
            <Link className="w-full" href={value} size="lg">
              {key}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
