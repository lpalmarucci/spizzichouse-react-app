import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { commonColors } from '@nextui-org/react';
import { DashboardLineChartData } from '../../models/Dashboard.ts';
import { useTranslation } from 'react-i18next';

type DashboardLineChartProps = {
  data: DashboardLineChartData[];
};

export default function DashboardLineChart(props: DashboardLineChartProps) {
  const { t } = useTranslation();
  return (
    <ResponsiveContainer width="100%" maxHeight={320} className="mt-4">
      <LineChart
        width={500}
        height={300}
        data={props.data}
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
    </ResponsiveContainer>
  );
}
