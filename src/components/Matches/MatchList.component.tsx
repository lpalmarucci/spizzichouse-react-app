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
      <div className="w-full flex flex-wrap  justify-between gap-2 gap-y-10">
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
