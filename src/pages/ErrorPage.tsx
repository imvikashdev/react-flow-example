import { ErrorResponse, useNavigate, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError() as ErrorResponse;
  const navigate = useNavigate();
  console.error(error);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Oops! Something went wrong.
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            We're sorry for the inconvenience. Please try again or contact our
            support team if the problem persists.
          </p>
        </div>
        <div className="mt-5 flex justify-center">
          <button
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}
