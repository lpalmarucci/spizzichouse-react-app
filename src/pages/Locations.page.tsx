import Title from '../components/Title.component';
import { useTranslation } from 'react-i18next';

function LocationsPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-[4rem] text-center w-full pt-16">
      <Title>{t('menu.locations')}</Title>
    </div>
  );
}

export default LocationsPage;
