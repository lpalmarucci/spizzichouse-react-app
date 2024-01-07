import { Player } from './Player.ts';

export type Round = {
  roundId: number;
  userId: number;
  matchId: number;
  points: number;
  user: Player;
};

export type StatusPlayer = 'winning' | 'neutral' | 'losing';

export type AggregatedRound = {
  player: Player;
  rounds: Round[];
  status: StatusPlayer;
  totalPoints: number;
};
