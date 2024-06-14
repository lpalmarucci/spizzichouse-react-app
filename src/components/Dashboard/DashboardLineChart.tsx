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

const NUM_MATCHES_TO_SHOWS: number = 5;

export default function DashboardLineChart() {
  const [summaryData, setSummaryData] = useState<DashboardLineChartData[]>();
  const { t } = useTranslation();
  const fetch = useFetch();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await fetch<DashboardMatchHistory[]>(
          ApiEndpoints.summaryHistory.concat(`?limit=${NUM_MATCHES_TO_SHOWS}`),
          'GET',
        );
        const lineChartData: DashboardLineChartData[] = data.map((d) => ({
          label: t('dashboard.charts.matchNumber').replace(
            '{num}',
            d.match_id.toString(),
          ),
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
          {t('dashboard.charts.lastNumberOfMatches').replace(
            '{num}',
            NUM_MATCHES_TO_SHOWS.toString(),
          )}
        </h1>
      </CardHeader>
      <CardBody className="px-0">
        <LineChart
          width={550}
          height={300}
          className="mx-auto"
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
            labelClassName="text-black bg-foreground"
            wrapperClassName="bg-foreground text-foreground bg-inherit border-1 rounded-md"
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
