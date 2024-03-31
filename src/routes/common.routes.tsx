import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard.page';
import Header from '../components/Header.component';
import PlayersPage from '../pages/Players.page';
import LocationsPage from '../pages/Locations.page';
import LoginPage from '../pages/Login.page';
import MatchesPage from '../pages/Matches.page.tsx';
import NotFoundPage from '../pages/NotFound.page.tsx';
import MatchDetailPage from '../pages/MatchDetail.page.tsx';
import SignUpPage from '../pages/SignUp.page.tsx';

export const ROUTES = {
  Dashboard: '/dashboard',
  Players: '/players',
  Matches: '/matches',
  Locations: '/locations',
  Login: '/login',
};

const commonRoutes: RouteObject[] = [
  {
    path: '',
    element: (
      <main className="w-full h-full min-h-[100dvh] flex flex-col items-center justify-start">
        <Header />
        <main className="relative w-full h-full">
          <Outlet />
        </main>
      </main>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'locations',
        element: <LocationsPage />,
      },
      {
        path: 'players',
        element: <PlayersPage />,
      },
      {
        path: 'matches',
        element: <MatchesPage />,
      },
      {
        path: 'matches/:id',
        element: <MatchDetailPage />,
      },
    ],
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'signup',
    element: <SignUpPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export default commonRoutes;
