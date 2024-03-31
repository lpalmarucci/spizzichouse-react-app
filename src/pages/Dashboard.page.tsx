import { useAuthUser } from 'react-auth-kit';
import useFetch from '../hooks/useFetch.tsx';
import { useEffect, useMemo, useState } from 'react';
import ApiEndpoints from '../costants/ApiEndpoints.ts';
import {
  DashboardLineChartData,
  DashboardMatchHistory,
  DashboardPieChartData,
} from '../models/Dashboard.ts';
import DashboardPieChart from '../components/Dashboard/DashboardPieChart.tsx';
import { useTranslation } from 'react-i18next';
import DashboardLineChart from '../components/Dashboard/DashboardLineChart.tsx';

const DashboardPage = () => {
  const authData = useAuthUser()();
  const fetch = useFetch();
  const [historyData, setHistoryData] = useState<DashboardMatchHistory[]>([]);
  const { t } = useTranslation();
  const pieChartData = useMemo<DashboardPieChartData[]>(() => {
    let wins = 0,
      loses = 0;
    historyData.forEach((hd) => {
      if (hd.win) wins++;
      else loses++;
    });
    return [
      {
        name: t('labels.matchWin'),
        value: wins,
      },
      {
        name: t('labels.matchLose'),
        value: loses,
      },
    ];
  }, [historyData]);
  const lineChartData = useMemo<DashboardLineChartData[]>(() => {
    const result: DashboardLineChartData[] = [];
    historyData.forEach((hd) => {
      result.push({
        label: `Partita #${hd.match_id}`,
        score: hd.score,
        totalPoints: hd.total_points,
      });
    });
    return result;
  }, [historyData]);

  console.log({ lineChartData });

  useEffect(() => {
    async function fetchDashboardData() {
      const data = await fetch<DashboardMatchHistory[]>(
        ApiEndpoints.summary,
        'GET',
      );
      setHistoryData(data);
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col w-full h-full py-6 px-6 max-w-7xl justify-center mx-auto">
      <h1 className="text-3xl md:text-5xl text-foreground font-bold">
        {t('dashboard.title').replace('{user}', authData?.username)}
      </h1>
      <span className="text-lg md:text-2xl text-foreground ">
        {t('dashboard.subtitle')}
      </span>
      <div className="w-full h-full flex flex-col md:flex-row items-center gap-4">
        <DashboardPieChart data={pieChartData} />
        <DashboardLineChart data={lineChartData} />
      </div>
    </div>
  );
};

export default DashboardPage;
