import React from 'react';
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { getInitialLetters } from '../../shared/utils.tsx';
import { VerticalDotsIcon } from '../../icons/VerticalDotsIcon.tsx';
import { Match } from '../../models/Match.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AlertDialog from '../AlertDialog.component.tsx';
import useFetch from '../../hooks/useFetch.tsx';
import { useToast } from '../../context/Toast.context.tsx';
import ApiEndpoints from '../../costants/ApiEndpoints.ts';
import { useDialogContext } from '../../context/Dialog.context.tsx';
import { IMatchFilters } from './MatchFilters.component.tsx';

interface IMatchCardProps {
  match: Match;
  getAllMatches: (filters: IMatchFilters) => Promise<void>;
}

export default function MatchCard({ match, getAllMatches }: IMatchCardProps) {
  const { selectedData, setSelectedData, openDialog } = useDialogContext<Match>();
  const {
    isOpen: isOpenEndMatchDialog,
    onOpen: onOpenEndMatchDialog,
    onOpenChange: onOpenChangeEndMatchDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteMatchDialog,
    onOpen: onOpenDeleteMatchDialog,
    onOpenChange: onOpenChangeDeleteMatchDialog,
  } = useDisclosure();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchData = useFetch();
  const { showAlertMessage } = useToast();

  const handleEndMatch = React.useCallback(() => {
    if (!selectedData) return;
    const url = ApiEndpoints.updateMatch.replace(':id', selectedData?.id.toString()).concat('?end=true');
    const body = JSON.stringify({ inProgress: false });
    fetchData<Match>(url, 'PATCH', { body }).then(() => {
      showAlertMessage({
        message: t('matches.messages.matchEnded'),
        type: 'success',
      });
      getAllMatches({});
    });
  }, [selectedData, setSelectedData]);

  const handleDeleteMatch = React.useCallback(() => {
    if (!selectedData) return;
    const url = ApiEndpoints.deleteMatch.replace(':id', selectedData?.id.toString());
    fetchData<Match>(url, 'DELETE').then(() => {
      showAlertMessage({
        message: t('matches.messages.deleteSuccess'),
        type: 'success',
      });
      getAllMatches({});
    });
  }, [selectedData, setSelectedData]);

  return (
    <>
      <Card
        shadow="md"
        isPressable
        onPress={() => navigate(match.id.toString())}
        as="div"
        classNames={{
          base: 'flex-grow shadow-small',
        }}
      >
        <CardHeader className="justify-between gap-8 pb-0">
          <span className="min-w-fit">
            {t('matches.labels.matchId')}: {match.id}
          </span>
          {match.inProgress ? (
            <Chip color="success" variant="dot">
              {t('matches.labels.inProgress')}
            </Chip>
          ) : (
            <Chip color="danger" variant="bordered">
              {t('matches.labels.ended')}
            </Chip>
          )}
        </CardHeader>
        <CardBody className="py-8 items-center">
          <AvatarGroup isBordered size="md" color="default" max={3}>
            {match.users.map((player) => (
              <Tooltip key={player.id} content={`${player.firstname} ${player.lastname}`}>
                <Avatar name={getInitialLetters(player.firstname, player.lastname)} />
              </Tooltip>
            ))}
          </AvatarGroup>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="w-full flex flex-col gap-0.5 items-start text-gray-400">
            <span className="text-small italic">{match.location?.name}</span>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <VerticalDotsIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="edit"
                onPress={() => {
                  setSelectedData(match);
                  openDialog();
                }}
                isDisabled={!match.inProgress}
              >
                {t('buttons.edit')}
              </DropdownItem>
              <DropdownItem
                key="end_match"
                color="warning"
                className="text-warning"
                variant="flat"
                onPress={() => {
                  onOpenEndMatchDialog();
                  setSelectedData(match);
                }}
                isDisabled={!match.inProgress}
              >
                {t('buttons.endMatch')}
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                className="text-danger"
                onPress={() => {
                  setSelectedData(match);
                  onOpenDeleteMatchDialog();
                }}
              >
                {t('buttons.delete')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardFooter>
      </Card>

      <AlertDialog
        isOpen={isOpenEndMatchDialog}
        onOpenChange={onOpenChangeEndMatchDialog}
        contentText={t('matches.messages.askEndMatch').replace('{id}', selectedData?.id.toString() ?? '')}
        onCancel={() => setSelectedData(undefined)}
        onConfirm={handleEndMatch}
        confirmButtonText="Confirm"
      />
      <AlertDialog
        isOpen={isOpenDeleteMatchDialog}
        onOpenChange={onOpenChangeDeleteMatchDialog}
        contentText={t('matches.messages.askDelete').replace('{id}', selectedData?.id.toString() ?? '')}
        onCancel={() => setSelectedData(undefined)}
        onConfirm={handleDeleteMatch}
      />
    </>
  );
}
