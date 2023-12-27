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
} from '@nextui-org/react';
import { PlusIcon } from '../icons/PlusIcon.tsx';
import { SearchIcon } from '../icons/SearchIcon.tsx';
import { ChevronDownIcon } from '../icons/ChevronDownIcon.tsx';
import { capitalize } from '../shared/utils.tsx';
import { Player } from '../models/Player.ts';
import { ApiEndpoint } from '../models/constants.ts';
import useFetch from '../hooks/useFetch.tsx';
import CreateEditUserDialogComponent from '../components/Players/CreateEditUserDialog.component.tsx';
import EditIcon from '../icons/EditIcon.tsx';
import { DeleteIcon } from '../icons/DeleteIcon.tsx';

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'USERNAME', uid: 'username', sortable: true },
  { name: 'FIRSTNAME', uid: 'firstname', sortable: true },
  { name: 'LASTNAME', uid: 'lastname', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  console.log({ items });

  const renderCell = React.useCallback((user: Player, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof Player];

    switch (columnKey) {
      case 'actions':
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip content="Edit user" closeDelay={0}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon
                  onClick={() => {
                    setCurrentUser(user);
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user" closeDelay={0}>
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
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
            placeholder="Search by username..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
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
            <Button
              color="primary"
              onPress={() => {
                setCurrentUser(undefined);
                setIsModalOpen(true);
              }}
              endContent={<PlusIcon />}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {users.length} users
          </span>
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
    fetchData<Player[]>(ApiEndpoint.getUsers, 'get')
      .then((data) => setUsers(data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (currentUser) setIsModalOpen(true);
  }, [currentUser]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          isCompact
          showShadow
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
    <div className="flex flex-col items-center align-middle mx-auto w-full px-6 max-w-7xl">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
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
          emptyContent={'No users found'}
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
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
        isOpen={isModalOpen}
        onCloseDialog={(op: boolean) => {
          op && getUserData();
          setIsModalOpen(false);
        }}
        user={currentUser}
      />
    </div>
  );
}
