import { Match } from '../../models/Match.ts';
import MatchCard from './MatchCard.component.tsx';
import { useTranslation } from 'react-i18next';

function MatchList({
  matches,
  getAllMatches,
}: {
  matches: Match[];
  getAllMatches: () => Promise<Match[]>;
}) {
  const { t } = useTranslation();
  return (
    <>
      <div className="w-full  max-w-6xl">
        <div className="grid grid-cols-none sm:grid-cols-2 lg:grid-cols-4 gap-2 gap-y-10 overflow-auto p-8">
          {matches.length > 0 ? (
            matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                getAllMatches={getAllMatches}
              />
            ))
          ) : (
            <h1 className="w-full text-center text-xl col-span-full">
              {t('matches.not_available')}
            </h1>
          )}
        </div>
      </div>
    </>
  );
}

export default MatchList;
