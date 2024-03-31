export type DashboardMatchHistory = {
  match_id: number;
  score: number;
  total_points: number;
};

export type DashboardPieChartData = {
  name: string;
  value: number;
};

export type DashboardLineChartData = {
  label: string;
  score: number;
  totalPoints: number;
};

export type DashboardSummaryData = {
  wins: boolean;
  loses: boolean;
};
