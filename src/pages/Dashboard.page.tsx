import { useAuthUser } from 'react-auth-kit';

const DashboardPage = () => {
  const authData = useAuthUser()();
  console.log({ authData });
  return (
    <div className="flex flex-col text-center w-full">
      <h1 className="text-5xl text-white font-bold">
        Welcome, {authData?.firstname}
      </h1>
    </div>
  );
};

export default DashboardPage;
