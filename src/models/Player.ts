import { Location } from "./Location";

export type Player = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  location: Location;
  createdAt: Date;
  updateAt: Date;
};
