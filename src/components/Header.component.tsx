import React from "react";
import {
  Avatar,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  DropdownSection,
} from "@nextui-org/dropdown";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../routes/common.routes";
import { NavLink, useNavigate } from "react-router-dom";
import { useSignOut } from "react-auth-kit";

interface IHeaderComponentProps {}

const Header = (props: IHeaderComponentProps) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const signOut = useSignOut();
  const navigate = useNavigate();

  function handleLogout() {
    if (signOut()) {
      navigate(ROUTES.Login);
    }
  }

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className={"bg-inherit"}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>
      <NavbarBrand>
        <p
          className="font-bold text-inherit cursor-pointer"
          onClick={() => navigate(ROUTES.Dashboard)}
        >
          SPIZZICHOUSE
        </p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={window.location.pathname === ROUTES.Dashboard}>
          <NavLink
            to={ROUTES.Dashboard}
            color="primary"
            className={({ isActive }) => (isActive ? "link-active" : "")}
          >
            {t("menu.dashboard")}
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            className={({ isActive }) => (isActive ? "link-active" : "")}
            to={ROUTES.Players}
          >
            {t("menu.players")}
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <NavLink
            className={({ isActive }) => (isActive ? "link-active" : "")}
            to={ROUTES.Locations}
          >
            {t("menu.locations")}
          </NavLink>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href={ROUTES.Matches}>
            {t("menu.matches")}
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        <Dropdown placement="bottom-end" showArrow>
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions">
            <DropdownSection title="User" showDivider>
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">{t("buttons.signInAs")}</p>
                <p className="font-semibold">zoey@example.com</p>
              </DropdownItem>
              <DropdownItem key="settings">{t("buttons.settings")}</DropdownItem>
            </DropdownSection>
            <DropdownSection title="Actions">
              <DropdownItem
                key="logout"
                color="danger"
                className="text-danger"
                onClick={handleLogout}
              >
                {t("buttons.logout")}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu>
        {Object.entries(ROUTES).map(([key, value], index) => (
          <NavbarMenuItem key={value}>
            <Link className="w-full" href="#" size="lg">
              {key}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
