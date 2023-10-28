import React, { useCallback, useMemo, useState } from "react";
import { Player } from "../../models/Player";
import { useTranslation } from "react-i18next";
import {
  Button,
  Chip,
  Input,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { getInitialLetters } from "../../shared/utils";
import { EditIcon } from "../icons/EditIcon.component";
import { DeleteIcon } from "../icons/DeleteIcon.component";
import { SearchIcon } from "../icons/SearchIcon.component";
import { PlusIcon } from "../icons/PlusIcon.component";
import CreateEditPlayerModal from "./CreateEditPlayerModal.component";
import { useAuthUser } from "react-auth-kit";
import { ApiEndpoint } from "../../models/constants";
import useFetch from "../../hooks/useFetch";
import { useToast } from "../../context/Toast.context";

const rowsPerPage = 5;

type Props = {
  players: Player[];
  fetchPlayers: () => void;
};

const PlayersTable = (props: Props) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const auth = useAuthUser();
  const { add } = useToast();
  const fetchData = useFetch();
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const handleDeletePlayer = useCallback((id: number) => {
    fetchData<any>(ApiEndpoint.deletePlayer.replace("{id}", id.toString()), "delete")
      .then(() => {
        add({ message: t("players.deleteSuccess"), type: "success" });
      })
      .finally(() => props.fetchPlayers());
  }, []);

  const columns = useMemo(
    () => [
      { name: t("players.columns.name"), uid: "name" },
      { name: t("players.columns.location"), uid: "location" },
      { name: "", uid: "status" },
      { name: t("players.columns.lastUpdate"), uid: "updatedAt" },
      { name: t("players.columns.actions"), uid: "actions" },
    ],
    [],
  );
  const filteredItems = useMemo(() => {
    let filteredPlayers = [...props.players];

    if (!!filterValue) {
      filteredPlayers = filteredPlayers.filter((player) =>
        player.username.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredPlayers;
  }, [props.players, filterValue]);

  const pages = filteredItems.length === 0 ? 1 : Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const renderCell = useCallback((player: Player, columnKey: React.Key) => {
    const cellValue = player[columnKey as keyof Player];

    switch (columnKey) {
      case "name":
        return (
          <User
            name={`${player.firstname} ${player.lastname}`}
            description={`@${player.username}`}
            avatarProps={{
              name: getInitialLetters(player.firstname, player.lastname),
            }}
          />
        );
      case "location":
        return (
          <span className={cellValue ? "text-md font-semibold underline" : "italic text-sm"}>
            {cellValue ? player.location.name : t("label.noneF")}
          </span>
        );
      case "status":
        return player.id === auth()?.id ? (
          <Chip color="success" className="text-green-900">
            {t("players.currentLogged")}
          </Chip>
        ) : (
          <React.Fragment />
        );
      case "updatedAt":
        return (
          <span className="">
            {new Intl.DateTimeFormat("it-IT", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(player.updateAt))}
          </span>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Popover
              showArrow
              isOpen={isPopoverOpen}
              onOpenChange={(open) => setIsPopoverOpen(open)}
              placement="top"
              backdrop="opaque"
              className="dark text-foreground bg-background"
            >
              <PopoverTrigger>
                <span
                  className={`text-lg text-danger cursor-pointer active:opacity-50 ${
                    player.id === auth()?.id ? "hidden" : ""
                  }`}
                >
                  <DeleteIcon />
                </span>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2 flex flex-col gap-3">
                  <div className="text-md"></div>
                  <h4 className="text-md">
                    {t("players.askDelete").replace("#", player.username)}
                  </h4>
                  <div className="flex justify-end items-center gap-1">
                    <Button
                      variant="bordered"
                      color="danger"
                      size="sm"
                      onClick={() => setIsPopoverOpen(false)}
                    >
                      {t("buttons.cancel")}
                    </Button>
                    <Button
                      variant="shadow"
                      color="primary"
                      size="sm"
                      onClick={() => handleDeletePlayer(player.id)}
                    >
                      {t("buttons.confirm")}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by username..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <Button color="primary" endContent={<PlusIcon />} onPress={onOpen}>
            {t("buttons.createNew")}
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            {t("players.total").replace("#", props.players.length.toString())}
          </span>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, props.players.length, !!filterValue]);

  return (
    <>
      <Table
        topContentPlacement="outside"
        bottomContentPlacement="outside"
        className="max-w-4xl w-full mx-auto"
        isStriped
        topContent={topContent}
        bottomContent={
          <Pagination
            className="flex justify-center items-center"
            isCompact
            showControls
            showShadow
            color="primary"
            total={pages}
            page={page}
            initialPage={1}
            onChange={setPage}
          />
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent={t("players.none")}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CreateEditPlayerModal
        onCloseModal={() => props.fetchPlayers()}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
};

export default PlayersTable;
