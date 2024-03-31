import { Cell, Legend, Pie, PieChart } from 'recharts';
import {
  DashboardPieChartData,
  DashboardSummaryData,
} from '../../models/Dashboard.ts';
import { Card, CardBody, CardHeader, commonColors } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import useFetch from '../../hooks/useFetch.tsx';
import ApiEndpoints from '../../costants/ApiEndpoints.ts';
import { useTranslation } from 'react-i18next';

const COLORS = [commonColors.green[500], commonColors.red[500]];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function DashboardPieChart() {
  const [summaryData, setSummaryData] = useState<DashboardSummaryData>();
  const { t } = useTranslation();
  const fetch = useFetch();
  const pieChartData = useMemo<DashboardPieChartData[]>(() => {
    return [
      {
        name: t('labels.matchWins'),
        value: summaryData?.wins ?? 0,
      },
      {
        name: t('labels.matchLoses'),
        value: summaryData?.loses ?? 0,
      },
    ] as DashboardPieChartData[];
  }, [summaryData]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const data = await fetch<DashboardSummaryData>(
          ApiEndpoints.summary,
          'GET',
        );
        setSummaryData(data);
      } catch (e) {
        console.log(e);
      }
    }

    fetchDashboardData();
  }, []);

  if (!pieChartData) return;
  return (
    <Card className="w-full h-full flex justify-center py-3 px-6">
      <CardHeader>
        <h1 className="text-3xl text-foreground font-semibold w-full text-center">
          {t('labels.allMatches')}
        </h1>
      </CardHeader>
      <CardBody className="justify-center">
        <PieChart width={250} height={300} className="mx-auto">
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            type="monotone"
          />
          <Pie
            data={pieChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            dataKey="value"
            legendType="circle"
            animationDuration={750}
          >
            {pieChartData.map((_, index) => (
              <Cell
                key={`cell-${Math.random()}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </CardBody>
    </Card>
  );
}

export default DashboardPieChart;
