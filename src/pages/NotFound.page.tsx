import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[100dvh] w-full flex flex-col gap-6 justify-center items-center">
      <div className="flex gap-2 text-6xl">
        👀
        <div className="text-6xl text-foreground font-bold">
          <h1 className="text-transparent bg-gradient-to-r from-red-600 to-amber-700 bg-clip-text">
            404 Not Found
          </h1>
        </div>
      </div>
      <p
        className="text-large cursor-pointer transition-all hover:underline"
        onClick={() => navigate('/')}
      >
        Return to Homepage
      </p>
    </div>
  );
}

export default NotFoundPage;
