import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import Dashboard from './pages/Dashboard';
import WorkFlow from './pages/WorkFlow';
import Home from './pages/Home';
import { useCallback, useEffect } from 'react';
import { getWorkflows } from './utils/db';
import { WorkFlowDto, setWorkFlowFromDb } from './store/workflow';
import { useDispatch } from 'react-redux';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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

function App() {
  const dispatch = useDispatch();

  const saveWorkflowsToRedux = useCallback(async () => {
    try {
      const workflows: Array<WorkFlowDto> = await getWorkflows();
      dispatch(setWorkFlowFromDb(workflows));
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  useEffect(() => {
    saveWorkflowsToRedux();
  }, [saveWorkflowsToRedux]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
