import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Match } from '../../models/Match.ts';
import useFetch from '../../hooks/useFetch.tsx';
import { ApiEndpoint } from '../../models/constants.ts';
import { useNavigate } from 'react-router-dom';

function MatchList() {
  const fetchData = useFetch();
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
    fetchData<Match[]>(ApiEndpoint.getMatches, 'GET').then((data) =>
      setMatches(data),
    );
  }, []);

  return (
    <div className="gap-2 gap-y-10 grid grid-cols-2 sm:grid-cols-4">
      {matches.map((item, index) => (
        <Card
          shadow="md"
          key={index}
          isPressable
          onPress={() => navigate(item.id.toString())}
        >
          <CardHeader className="justify-between gap-8 pb-0">
            <span>ID Partita: {item.id}</span>
            {item.inProgress ? (
              <Chip color="success" variant="dot">
                In corso
              </Chip>
            ) : (
              <Chip color="danger" variant="bordered">
                Terminata
              </Chip>
            )}
          </CardHeader>
          <CardBody />
          <Divider />
          <CardFooter>
            <div className="w-full flex flex-col gap-0.5 items-start text-gray-400">
              <span className="text-small italic">{item.location?.name}</span>
            </div>
            {/*<p className="text-default-500">{item.price}</p>*/}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default MatchList;
