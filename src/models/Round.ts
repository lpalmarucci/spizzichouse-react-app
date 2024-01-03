import { Player } from './Player.ts';

export type Round = {
  roundId: number;
  userId: number;
  matchId: number;
  points: number;
  user: Player;
};
