import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardBody, CardHeader, commonColors } from '@nextui-org/react';
import {
  DashboardLineChartData,
  DashboardMatchHistory,
} from '../../models/Dashboard.ts';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch.tsx';
import ApiEndpoints from '../../costants/ApiEndpoints.ts';

type DashboardLineChartProps = {
  data: DashboardLineChartData[];
};

export default function DashboardLineChart() {
  const [summaryData, setSummaryData] = useState<DashboardLineChartData[]>();
  const { t } = useTranslation();
  const fetch = useFetch();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await fetch<DashboardMatchHistory[]>(
          ApiEndpoints.summaryHistory,
          'GET',
        );
        const lineChartData: DashboardLineChartData[] = data.map((d) => ({
          label: `Partita #${d.match_id}`,
          score: d.score,
          totalPoints: d.total_points,
        }));
        setSummaryData(lineChartData);
      } catch (e) {
        console.log(e);
      }
    }

    fetchDashboardData();
  }, []);

  console.log(summaryData);

  return (
    <Card className="w-full h-full flex justify-center py-3 px-6">
      <CardHeader>
        <h1 className="text-2xl font-semibold text-foreground w-full text-center">
          Ultime 10 partite
        </h1>
      </CardHeader>
      <CardBody>
        <LineChart
          width={500}
          height={300}
          data={summaryData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip
            labelClassName="text-black"
            wrapperClassName="bg-foreground text-foreground"
          />
          <Legend />
          <Line
            key={Math.random()}
            type="monotone"
            dataKey="score"
            name={t('dashboard.charts.totalScore')}
            stroke={commonColors.blue[400]}
            strokeWidth={3}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
          <Line
            key={Math.random()}
            type="monotone"
            dataKey="totalPoints"
            name={t('dashboard.charts.totalPoints')}
            stroke={commonColors.red[500]}
            strokeWidth={3}
            activeDot={{ r: 8 }}
            dot={{ r: 4 }}
          />
        </LineChart>
      </CardBody>
    </Card>
  );
}
