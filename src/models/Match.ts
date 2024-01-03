import { Location } from './Location.ts';
import { Player } from './Player.ts';

export type Match = {
  id: number;
  totalPoints: number;
  inProgress: boolean;
  location?: Location;
  users: Player[];
};
