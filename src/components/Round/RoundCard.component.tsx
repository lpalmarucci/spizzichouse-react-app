import React, { Dispatch, SetStateAction } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import { AggregatedRound, Round } from '../../models/Round.ts';
import EditIcon from '../../icons/EditIcon.tsx';
import { DeleteIcon } from '../../icons/DeleteIcon.tsx';
import { useTranslation } from 'react-i18next';
import { Match } from '../../models/Match.ts';

interface IRoundCardProps {
  aggregatedRound: AggregatedRound;
  currentMatch: Match;
  setSelectedRound: Dispatch<SetStateAction<Round | undefined>>;
  onOpenAlertDialog: () => void;
  onOpenEditRoundDialog: () => void;
}

function RoundCard({
  currentMatch,
  aggregatedRound,
  setSelectedRound,
  onOpenAlertDialog,
  onOpenEditRoundDialog,
}: IRoundCardProps) {
  const { rounds } = aggregatedRound;
  const { t } = useTranslation();

  const roundTableColumns = React.useMemo(
    () => [
      { name: t('matches.labels.roundNumber'), uid: 'roundId' },
      { name: t('matches.labels.points'), uid: 'points' },
      { name: t('matches.labels.actions'), uid: 'actions' },
    ],
    [],
  );
  //Remove actions table column if the match is not in progress anymore
  const filteredRoundTableColumns = React.useMemo(() => {
    if (currentMatch.inProgress) return roundTableColumns;
    return roundTableColumns.filter((c) => c.uid !== 'actions');
  }, [currentMatch]);

  const renderCell = React.useCallback((round: Round, columnKey: React.Key) => {
    const cellValue = round[columnKey as keyof Round];

    switch (columnKey) {
      case 'actions':
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip content={'Edit round'} closeDelay={0}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon
                  onClick={() => {
                    setSelectedRound(round);
                    onOpenEditRoundDialog();
                  }}
                />
              </span>
            </Tooltip>
            <Tooltip color="danger" content={'Delete round'} closeDelay={0}>
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon
                  onClick={() => {
                    setSelectedRound(round);
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

  return (
    <div className="flex gap-5 p-8 pt-2">
      <Table color="primary">
        <TableHeader columns={filteredRoundTableColumns}>
          {(column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={t('emptyContent.Locations')} items={rounds}>
          {(r) => (
            <TableRow key={`${r.roundId}-${r.userId}-${r.matchId}`}>
              {(columnKey) => <TableCell>{renderCell(r, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default RoundCard;
