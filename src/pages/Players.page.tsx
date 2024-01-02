import React, { useEffect, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { SearchIcon } from '../icons/SearchIcon.tsx';
import { capitalize } from '../shared/utils.tsx';
import { Player } from '../models/Player.ts';
import { ApiEndpoint } from '../models/constants.ts';
import useFetch from '../hooks/useFetch.tsx';
import CreateEditUserDialogComponent from '../components/Players/CreateEditUserDialog.component.tsx';
import EditIcon from '../icons/EditIcon.tsx';
import { DeleteIcon } from '../icons/DeleteIcon.tsx';
import { useToast } from '../context/Toast.context.tsx';
import AlertDialog from '../components/AlertDialog.component.tsx';
import { VerticalDotsIcon } from '../icons/VerticalDotsIcon.tsx';
import { useTranslation } from 'react-i18next';

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Username', uid: 'username', sortable: true },
  { name: 'Firstname', uid: 'firstname', sortable: true },
  { name: 'Lastname', uid: 'lastname', sortable: true },
  { name: 'Actions', uid: 'actions' },
];

const INITIAL_VISIBLE_COLUMNS = [
  'id',
  'firstname',
  'lastname',
  'username',
  'actions',
];

export default function PlayersPage() {
  const fetchData = useFetch();
  const { showAlertMessage } = useToast();
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAlertDialog,
    onOpen: onOpenAlertDialog,
    onOpenChange: onOpenChangeAlertDialog,
  } = useDisclosure();
  const [currentUser, setCurrentUser] = useState<Player | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Player[]>([]);
  const [filterValue, setFilterValue] = React.useState('');
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'id',
    direction: 'ascending',
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.username.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredUsers;
  }, [users, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const sortedItems = React.useMemo<Player[]>(() => {
    return [...filteredItems].sort((a: Player, b: Player) => {
      const first = a[sortDescriptor.column as keyof Player] as number;
      const second = b[sortDescriptor.column as keyof Player] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const renderCell = React.useCallback((user: Player, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof Player];

    switch (columnKey) {
      case 'actions':
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip content={t('players.tooltip.editUser')} closeDelay={0}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon
                  onClick={() => {
                    setCurrentUser(user);
                    onOpen();
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip
              color="danger"
              content={t('players.tooltip.deleteUser')}
              closeDelay={0}
            >
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon
                  onClick={() => {
                    setCurrentUser(user);
                    onOpenAlertDialog();
                  }}
                />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return <span>{cellValue.toString()}</span>;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder={t('players.searchPlaceholder')}
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              onPress={() => {
                setCurrentUser(undefined);
                onOpen();
              }}
              endContent={<PlusIcon />}
            >
              {t('buttons.addNew')}
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} users
          </span>
          <div className="flex gap-0.5">
            <label className="flex items-center text-default-400 text-small">
              Rows per page:
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
            <Dropdown>
              <DropdownTrigger className="sm:flex">
                <Button isIconOnly variant="light">
                  <VerticalDotsIcon className="text-small" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem
                    key={column.uid}
                    className="capitalize"
                    isDisabled={['id', 'actions'].includes(column.uid)}
                  >
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    users.length,
    hasSearchFilter,
  ]);

  const getUserData = () => {
    fetchData<Player[]>(ApiEndpoint.getUsers, 'GET')
      .then((data) => {
        setUsers(data);
        if (items.length === 1) setPage(1);
        setCurrentUser(undefined);
        setFilterValue('');
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteUser = async () => {
    if (!currentUser) return;
    const { id } = currentUser;
    const url = ApiEndpoint.deleteUser.replace(':id', id.toString());
    setIsLoading(true);
    fetchData<Omit<Player, 'id'>>(url, 'DELETE')
      .then(() => {
        showAlertMessage({
          message: t('players.messages.deleteSuccess'),
          type: 'success',
        });
        getUserData();
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getUserData();
  }, []);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
          hidden={items.length === 0}
        />
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);

  return (
    <div className="flex flex-col gap-12 items-center align-middle mx-auto w-full px-6 max-w-7xl">
      <h1 className="text-6xl text-foreground font-bold">
        {t('players.title')}
      </h1>
      <Table
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[420px]',
        }}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSortChange={setSortDescriptor}
        color="primary"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} allowsSorting={column.sortable}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={t('emptyContent.users')}
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner label={t('loading')} />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <CreateEditUserDialogComponent
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCloseDialog={getUserData}
        user={currentUser}
      />
      <AlertDialog
        isOpen={isOpenAlertDialog}
        onOpenChange={onOpenChangeAlertDialog}
        onConfirm={handleDeleteUser}
        contentText={
          <div className="flex gap-1">
            {t('players.messages.askDelete').replace(
              '{name}',
              currentUser?.username ?? 'none',
            )}
          </div>
        }
      />
    </div>
  );
}
