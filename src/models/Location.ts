import { Player } from './Player.ts';

export type Location = {
  id: number;
  name: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  users: Player[];
};
