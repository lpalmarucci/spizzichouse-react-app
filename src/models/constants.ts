export const ApiEndpoint = {
  //Authentication
  login: '/auth/login',
  //User
  getUsers: '/users',
  getSingleUser: '/users/:id',
  createUser: '/users',
  updateUser: '/users/:id',
  deleteUser: '/users/:id',

  //locations
  getLocations: '/locations',
  getSingleLocation: '/locations/:id',
  createLocation: '/locations',
  updateLocation: '/locations/:id',
  deleteLocation: '/locations/:id',

  //Match
  getMatches: '/matches',
  getSingleMatch: '/matches/:id',
  createMatch: '/matches',
  updateMatch: '/matches/:id',
  deleteMatch: '/matches/:id',

  //Round
  getRoundsByMatchId: '/matches/:matchId/rounds',
  createRound: '/matches/:matchId/users/:userId/rounds/:roundId',
  deleteRound: '/matches/:matchId/users/:userId/rounds/:roundId',
};
