import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import App from './App.tsx';
import WorkFlow from './pages/WorkFlow.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'dashboard',
    element: <Dashboard />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'workflow/:workflowId',
    element: <WorkFlow />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
);
