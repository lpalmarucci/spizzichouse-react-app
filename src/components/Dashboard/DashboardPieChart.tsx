import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { DashboardPieChartData } from '../../models/Dashboard.ts';
import { commonColors } from '@nextui-org/react';

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

function DashboardPieChart(props: { data: DashboardPieChartData[] }) {
  return (
    <ResponsiveContainer width="100%" maxHeight={320}>
      <PieChart width={250} height={250}>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          type="monotone"
        />
        <Pie
          data={props.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          dataKey="value"
          legendType="circle"
          animationDuration={750}
        >
          {props.data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export default DashboardPieChart;
