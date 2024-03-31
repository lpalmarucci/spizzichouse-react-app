import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

function DashboardRanking() {
  const { t } = useTranslation();
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {}, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="min-w-full p-8">
        <CardHeader className="justify-center">
          <h4 className="text-3xl text-foreground font-semibold text-center">
            {t('labels.globalRanking')}
          </h4>
        </CardHeader>
        <CardBody className="flex-center">
          <div className="max-w-[400px] mx-auto w-full h-full flex justify-center items-center">
            <div className=" w-full h-full flex gap-4 justify-between min-h-[256px]">
              <div className="w-full max-w-[56px] flex flex-col gap-6 items-center justify-end">
                <span>
                  <b>2°</b>
                </span>
                <div className="h-full w-full basis-1/2 bg-primary-400 border-1 border-transparent rounded-sm" />
                <span>gcabu</span>
              </div>
              <div className="w-full max-w-[56px] flex flex-col gap-6 items-center justify-end">
                <span>
                  <b>1°</b>
                </span>
                <div className="h-full w-full bg-primary-400 border-1 border-transparent rounded-sm" />
                <span>palmareggio</span>
              </div>
              <div className="w-full max-w-[56px] flex flex-col gap-6 items-center justify-end">
                <span>
                  <b>3°</b>
                </span>
                <div className="h-full w-full basis-1/3 bg-primary-400 border-1 border-transparent rounded-sm" />
                <span>colax</span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default DashboardRanking;
