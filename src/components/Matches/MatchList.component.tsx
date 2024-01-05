import {
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Tooltip,
} from '@nextui-org/react';
import { Match } from '../../models/Match.ts';
import { useNavigate } from 'react-router-dom';
import { getInitialLetters } from '../../shared/utils.tsx';

function MatchList({ matches }: { matches: Match[] }) {
  const navigate = useNavigate();
  return (
    <div className="gap-2 gap-y-10 grid grid-cols-2 sm:grid-cols-4">
      {matches.map((match, index) => (
        <Card
          shadow="md"
          key={index}
          isPressable
          onPress={() => navigate(match.id.toString())}
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
                    name={getInitialLetters(player.firstname, player.lastname)}
                  />
                </Tooltip>
              ))}
            </AvatarGroup>
          </CardBody>
          <Divider />
          <CardFooter>
            <div className="w-full flex flex-col gap-0.5 items-start text-gray-400">
              <span className="text-small italic">{match.location?.name}</span>
            </div>
            {/*<p className="text-default-500">{item.price}</p>*/}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default MatchList;
