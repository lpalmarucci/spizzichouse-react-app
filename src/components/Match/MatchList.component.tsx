import { Match } from '../../models/Match.ts';
import MatchCard from './MatchCard.component.tsx';

function MatchList({
  matches,
  getAllMatches,
}: {
  matches: Match[];
  getAllMatches: () => Promise<Match[]>;
}) {
  return (
    <>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-start gap-2 gap-y-10 overflow-auto">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            getAllMatches={getAllMatches}
          />
        ))}
      </div>
    </>
  );
}

export default MatchList;
