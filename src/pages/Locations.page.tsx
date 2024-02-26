import React, { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
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
import { capitalize, getInitialLetters } from '../shared/utils.tsx';
import useFetch from '../hooks/useFetch.tsx';
import EditIcon from '../icons/EditIcon.tsx';
import { DeleteIcon } from '../icons/DeleteIcon.tsx';
import { useToast } from '../context/Toast.context.tsx';
import { VerticalDotsIcon } from '../icons/VerticalDotsIcon.tsx';
import { useTranslation } from 'react-i18next';
import { Location } from '../models/Location.ts';
import { Player } from '../models/Player.ts';
import AlertDialog from '../components/AlertDialog.component.tsx';
import CreateEditLocationDialog from '../components/Locations/CreateEditLocation.component.tsx';
import ApiEndpoints from '../costants/ApiEndpoints.ts';

const alwaysVisibleColumns = ['id', 'actions'];

const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'Name', uid: 'name', sortable: true },
  { name: 'Address', uid: 'address' },
  { name: 'Users', uid: 'users' },
  { name: 'Actions', uid: 'actions' },
];

const INITIAL_VISIBLE_COLUMNS = ['id', 'name', 'users', 'actions'];

export default function LocationsPage() {
  const fetchData = useFetch();
  const { showAlertMessage } = useToast();
  const { t } = useTranslation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAlertDialog,
    onOpen: onOpenAlertDialog,
    onOpenChange: onOpenChangeAlertDialog,
  } = useDisclosure();
  const [currentLocation, setCurrentLocation] = useState<
    Location | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [Locations, setLocations] = useState<Location[]>([]);
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
    let filteredLocations = [...Locations];

    if (hasSearchFilter) {
      filteredLocations = filteredLocations.filter((location) =>
        location.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredLocations;
  }, [Locations, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const sortedItems = React.useMemo<Location[]>(() => {
    return [...filteredItems].sort((a: Location, b: Location) => {
      const first = a[sortDescriptor.column as keyof Location] as number;
      const second = b[sortDescriptor.column as keyof Location] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const renderCell = React.useCallback(
    (location: Location, columnKey: React.Key) => {
      const cellValue = location[columnKey as keyof Location];

      switch (columnKey) {
        case 'actions':
          return (
            <div className="relative flex items-center gap-4">
              <Tooltip
                content={t('locations.tooltip.editLocation')}
                closeDelay={0}
              >
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EditIcon
                    onClick={() => {
                      setCurrentLocation(location);
                      onOpen();
                    }}
                  />
                </span>
              </Tooltip>
              <Tooltip
                color="danger"
                content={t('locations.tooltip.deleteLocation')}
                closeDelay={0}
              >
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon
                    onClick={() => {
                      setCurrentLocation(location);
                      onOpenAlertDialog();
                    }}
                  />
                </span>
              </Tooltip>
            </div>
          );
        case 'users':
          return (
            <div className="flex justify-start">
              <AvatarGroup isBordered max={2} size="sm">
                {(cellValue as Player[]).map((player) => (
                  <Tooltip
                    key={player.id}
                    content={`${player.firstname} ${player.lastname}`}
                  >
                    <Avatar
                      name={getInitialLetters(
                        player.firstname,
                        player.lastname,
                      )}
                    />
                  </Tooltip>
                ))}
              </AvatarGroup>
            </div>
          );
        default:
          return <span>{cellValue.toString()}</span>;
      }
    },
    [],
  );

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
            placeholder={t('placeholders.searchByName')}
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              color="primary"
              onPress={() => {
                setCurrentLocation(undefined);
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
            Total {Locations.length} locations
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
                    isDisabled={alwaysVisibleColumns.includes(column.uid)}
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
    Locations.length,
    hasSearchFilter,
  ]);

  const fetchLocations = () => {
    fetchData<Location[]>(ApiEndpoints.getLocations, 'GET')
      .then((data) => {
        setLocations(data);
        if (items.length === 1) setPage(1);
        setCurrentLocation(undefined);
        setFilterValue('');
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteLocation = async () => {
    if (!currentLocation) return;
    const { id } = currentLocation;
    const url = ApiEndpoints.deleteLocation.replace(':id', id.toString());
    setIsLoading(true);
    fetchData<Omit<Location, 'id'>>(url, 'DELETE')
      .then(() => {
        showAlertMessage({
          message: t('locations.messages.deleteSuccess'),
          type: 'success',
        });
        fetchLocations();
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchLocations();
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
        {t('locations.title')}
      </h1>
      <Table
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[420px]',
          base: 'min-h-[56px]',
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
          emptyContent={t('locations.not_available')}
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
      <CreateEditLocationDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onCloseDialog={fetchLocations}
        location={currentLocation}
      />
      <AlertDialog
        isOpen={isOpenAlertDialog}
        onOpenChange={onOpenChangeAlertDialog}
        onConfirm={handleDeleteLocation}
        contentText={
          <div className="flex gap-1">
            {t('locations.messages.askDelete').replace(
              '{name}',
              currentLocation?.name ?? 'none',
            )}
          </div>
        }
      />
    </div>
  );
}
