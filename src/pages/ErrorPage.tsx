import { Button } from '@/components/ui/button';

type Props = {
  error: Error;
  resetErrorBoundary: () => void;
};

const ErrorPage = ({ error, resetErrorBoundary }: Props) => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Oops, something went wrong
        </h1>
        <pre>{error.message}</pre>
        <p className="text-xl md:text-2xl">
          We're sorry for the inconvenience.
        </p>
        <Button
          className="inline-flex mt-8 px-6 py-3 text-lg font-medium bg-white text-black rounded-md hover:bg-gray-100"
          onClick={resetErrorBoundary}
        >
          Go back to Home
        </Button>
      </div>
    </main>
  );
};

export default ErrorPage;
