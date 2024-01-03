import { Location } from './Location.ts';

export type Match = {
  id: number;
  totalPoints: number;
  maxPointsEachRound: number;
  inProgress: boolean;
  location?: Location;
};
