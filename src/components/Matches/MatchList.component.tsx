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
import { Match } from '../../models/Match.ts';
import { useNavigate } from 'react-router-dom';
import { getInitialLetters } from '../../shared/utils.tsx';
import { VerticalDotsIcon } from '../../icons/VerticalDotsIcon.tsx';
import React, { useState } from 'react';
import useFetch from '../../hooks/useFetch.tsx';
import { ApiEndpoint } from '../../models/constants.ts';
import { useToast } from '../../context/Toast.context.tsx';
import AlertDialog from '../AlertDialog.component.tsx';
import CreateEditMatchDialog from '../Match/CreateEditMatchDialog.component.tsx';

function MatchList({
  matches,
  fetchAllMatches,
}: {
  matches: Match[];
  fetchAllMatches: () => Promise<Match[]>;
}) {
  const navigate = useNavigate();
  const fetchData = useFetch();
  const [selectedMatch, setSelectedMatch] = useState<Match | undefined>();
  const {
    isOpen: isOpenEditMatchDialog,
    onOpen: onOpenEditMatchDialog,
    onOpenChange: onOpenChangeEditMatchDialog,
  } = useDisclosure();
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
  const { showAlertMessage } = useToast();

  const handleEndMatch = React.useCallback(() => {
    if (!selectedMatch) return;
    const url = ApiEndpoint.updateMatch.replace(
      ':id',
      selectedMatch?.id.toString(),
    );
    const body = JSON.stringify({ inProgress: false });
    fetchData<Match>(url, 'PATCH', { body }).then(() => {
      showAlertMessage({
        message: 'Match ended successfully',
        type: 'success',
      });
      fetchAllMatches();
    });
  }, [selectedMatch]);

  const handleDeleteMatch = React.useCallback(() => {
    if (!selectedMatch) return;
    const url = ApiEndpoint.deleteMatch.replace(
      ':id',
      selectedMatch?.id.toString(),
    );
    fetchData<Match>(url, 'DELETE').then(() => {
      showAlertMessage({
        message: 'Match deleted successfully',
        type: 'success',
      });
      fetchAllMatches();
    });
  }, [selectedMatch]);

  return (
    <>
      <div className="w-full flex flex-wrap gap-2 gap-y-10 ">
        {matches.map((match, index) => (
          <Card
            shadow="md"
            key={index}
            isPressable
            onPress={() => navigate(match.id.toString())}
            as="div"
          >
            <CardHeader className="justify-between gap-8 pb-0">
              <span>ID Partita: {match.id}</span>
              {match.inProgress ? (
                <Chip color="success" variant="dot">
                  In corso
                </Chip>
              ) : (
                <Chip color="danger" variant="bordered">
                  Terminata
                </Chip>
              )}
            </CardHeader>
            <CardBody className="py-8">
              <AvatarGroup isBordered size="md" color="default">
                {match.users.map((player) => (
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
            </CardBody>
            <Divider />
            <CardFooter>
              <div className="w-full flex flex-col gap-0.5 items-start text-gray-400">
                <span className="text-small italic">
                  {match.location?.name}
                </span>
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
                      onOpenEditMatchDialog();
                      setSelectedMatch(match);
                    }}
                  >
                    Modifica
                  </DropdownItem>
                  <DropdownItem
                    key="end_match"
                    color="warning"
                    className="text-warning"
                    variant="flat"
                    onPress={() => {
                      onOpenEndMatchDialog();
                      setSelectedMatch(match);
                    }}
                    isDisabled={!match.inProgress}
                  >
                    End match
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    color="danger"
                    className="text-danger"
                    onPress={() => {
                      onOpenDeleteMatchDialog();
                      setSelectedMatch(match);
                    }}
                  >
                    Elimina
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardFooter>
          </Card>
        ))}
      </div>
      <CreateEditMatchDialog
        isOpen={isOpenEditMatchDialog}
        onOpenChange={onOpenChangeEditMatchDialog}
        match={selectedMatch}
      />
      <AlertDialog
        isOpen={isOpenEndMatchDialog}
        onOpenChange={onOpenChangeEndMatchDialog}
        contentText={`Are you sure you want to end the match #${selectedMatch?.id}?`}
        onConfirm={handleEndMatch}
        confirmButtonText="Confirm"
      />
      <AlertDialog
        isOpen={isOpenDeleteMatchDialog}
        onOpenChange={onOpenChangeDeleteMatchDialog}
        contentText={`Are you sure you want to delete the match #${selectedMatch?.id}?`}
        onConfirm={handleDeleteMatch}
      />
    </>
  );
}

export default MatchList;
