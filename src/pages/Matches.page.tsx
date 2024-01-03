import { useTranslation } from 'react-i18next';
import MatchList from '../components/Matches/MatchList.component.tsx';

function MatchesPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-12 items-center align-middle mx-auto w-full px-6 max-w-7xl">
      <h1 className="text-6xl text-foreground font-bold">
        {t('locations.title')}
      </h1>
      <MatchList />
    </div>
  );
}

export default MatchesPage;
