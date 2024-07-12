import { useAuthUser } from 'react-auth-kit';
import DashboardPieChart from '../components/Dashboard/DashboardPieChart.tsx';
import { useTranslation } from 'react-i18next';
import DashboardRanking from '../components/Dashboard/DashboardRanking.tsx';
import DashboardLineChart from '../components/Dashboard/DashboardLineChart.tsx';

const DashboardPage = () => {
  const authData = useAuthUser()();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col w-full h-full px-6 max-w-screen-xl justify-center mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-5xl text-foreground font-bold">
          {t('dashboard.title').replace('{user}', authData?.username)}
        </h1>
        <span className="text-lg md:text-2xl text-foreground ">{t('dashboard.subtitle')}</span>
      </div>
      <div className="w-full h-full flex flex-col md:flex-row items-stretch gap-8 mt-12 mb-8">
        <DashboardPieChart />
        <DashboardLineChart />
      </div>
      <div className="w-full mb-8">
        <DashboardRanking />
      </div>
    </div>
  );
};

export default DashboardPage;
