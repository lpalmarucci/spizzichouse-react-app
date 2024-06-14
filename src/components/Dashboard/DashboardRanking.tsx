import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { DashboardRankingData } from '../../models/Dashboard.ts';
import ApiEndpoints from '../../costants/ApiEndpoints.ts';
import useFetch from '../../hooks/useFetch.tsx';

function DashboardRanking() {
  const { t } = useTranslation();
  const [rankingData, setRankingData] = useState<DashboardRankingData[]>([]);
  const fetchData = useFetch();

  useEffect(() => {
    async function fetchRankingData() {
      const data = await fetchData<DashboardRankingData[]>(
        ApiEndpoints.ranking,
        'GET',
      );
      const [first, second, third] = data;
      setRankingData([second, first, third]);
    }

    fetchRankingData();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="min-w-full p-8">
        <CardHeader className="justify-center">
          <h4 className="text-3xl text-foreground font-semibold text-center">
            {t('labels.globalRanking')}
          </h4>
        </CardHeader>
        <CardBody className="flex-center">
          <div className="max-w-[400px] mx-auto w-full h-full flex justify-center items-center">
            <div className=" w-full h-full flex gap-4 justify-between min-h-[256px]">
              {rankingData.map((rank, idx) => (
                <RankingPosition
                  key={rank.userId}
                  position={idx == 0 ? 2 : idx === 1 ? 1 : 3}
                  username={rank.username}
                />
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

interface IRankingPositionProps {
  username: string;
  position: number;
}

function getRankingPositionHeight(
  position: number,
): React.CSSProperties['flexBasis'] {
  switch (position) {
    case 1:
      return 'basis-full';
    case 2:
      return 'basis-1/2';
    case 3:
      return 'basis-1/3';
    default:
      return 'basis-full';
  }
}

function RankingPosition(props: IRankingPositionProps) {
  const basis = getRankingPositionHeight(props.position);

  return (
    <div
      className="w-full max-w-[56px] flex flex-col gap-6 items-center justify-end animate-appearance-in"
      style={{
        animationDelay: `${props.position / 4}s`,
      }}
    >
      <span>
        <b>{props.position}°</b>
      </span>
      <div
        className={`h-full w-full ${basis} bg-primary-400 border-1 border-transparent rounded-sm`}
      />
      <span>{props.username}</span>
    </div>
  );
}

export default DashboardRanking;
