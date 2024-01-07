import Builder from '@/components/core/Builder';
import SideBar from '@/components/core/SideBar';
import { ReduxStore } from '@/store';
import { getWorkFlowById } from '@/store/workflow';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

const WorkFlow = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const currentWorkflow = useSelector((state: ReduxStore) =>
    getWorkFlowById(state, workflowId || ''),
  );

  if (currentWorkflow === undefined) {
    return <Navigate to={'/dashboard'} replace />;
  }

  return (
    <div className="flex flex-col bg-slate-900 h-screen">
      <main className="flex flex-row h-100 h-screen">
        <aside className="w-0 md:w-60 p-0 md:p-2 !pr-0">
          <div className="h-full bg-slate-700 rounded-md shadow">
            <SideBar />
          </div>
        </aside>
        <section className="flex-grow p-2">
          <div className="h-full w-full rounded-md shadow overflow-hidden">
            <Builder />
          </div>
        </section>
      </main>
      <footer className="h-40 md:h-60 p-2 pt-0 overflow-auto">
        <div className="h-full bg-slate-700 rounded-md shadow p-4" />
      </footer>
    </div>
  );
};

export default WorkFlow;
