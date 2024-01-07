import Builder from '@/components/core/Builder';
import Loader from '@/components/core/Loader';
import SideBar from '@/components/core/SideBar';
import { ReduxStore } from '@/store';
import { dataFetched, getWorkFlowById } from '@/store/workflow';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

const WorkFlow = () => {
  const [expandFooter, setExpandFooter] = useState(false);
  const { workflowId } = useParams<{ workflowId: string }>();
  const currentWorkflow = useSelector((state: ReduxStore) =>
    getWorkFlowById(state, workflowId || ''),
  );
  const isLoading = useSelector(dataFetched);

  if (isLoading) {
    return <Loader />;
  }

  if (currentWorkflow === undefined && !isLoading) {
    return <Navigate to={'/dashboard'} replace />;
  }

  return (
    <div className="flex flex-col bg-slate-900 h-screen">
      <main className="flex flex-row h-100 h-screen">
        <aside className="w-14 hover:w-60 md:w-60 flex flex-col gap-2 p-2 !pr-0 ">
          <div className="flex-grow bg-slate-700 rounded-md shadow">
            <SideBar />
          </div>
          <div className=" bg-slate-700 rounded-md overflow-hidden shadow">
            <button
              className="flex items-center justify-center w-full h-12 text-slate-300 hover:bg-slate-600 hover:text-slate-50"
              onClick={() => setExpandFooter(!expandFooter)}
            >
              <span className="text-sm">Output</span>
            </button>
          </div>
        </aside>
        <section className="flex-grow p-2">
          <div className="h-full w-full rounded-md shadow overflow-hidden">
            <Builder />
          </div>
        </section>
      </main>
      <footer
        className={`${
          expandFooter ? 'h-40 md:h-60 p-2' : 'h-0'
        } transition-[height]  pt-0 overflow-auto`}
      >
        <div className="h-full bg-slate-700 rounded-md shadow p-4" />
      </footer>
    </div>
  );
};

export default WorkFlow;
