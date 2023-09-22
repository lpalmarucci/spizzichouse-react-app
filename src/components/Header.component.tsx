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
import { NavLink } from "react-router-dom";

interface IHeaderComponentProps {}

const menuItems = [
  "Profile",
  "Dashboard",
  "Activity",
  "Analytics",
  "System",
  "Deployments",
  "My Settings",
  "Team Settings",
  "Help & Feedback",
  "Log Out",
];

const Header = (props: IHeaderComponentProps) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  console.log(window.location.pathname === ROUTES.Dashboard);

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} isMenuOpen={isMenuOpen} className={"bg-inherit"}>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>
      <NavbarBrand>
        {/* <Image src={Logo } width={250} /> */}
        <p className="font-bold text-inherit">SPIZZICHOUSE</p>
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
          <NavLink to={ROUTES.Players}>{t("menu.players")}</NavLink>
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
              <DropdownItem key="logout" color="danger" className="text-danger">
                {t("buttons.logout")}
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2 ? "warning" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};
export default Header;
