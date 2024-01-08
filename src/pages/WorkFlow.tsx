import Builder from '@/components/core/Builder';
import Loader from '@/components/core/Loader';
import SideBar from '@/components/core/SideBar';
import { Button } from '@/components/ui/button';
import { ReduxStore } from '@/store';
import {
  ArrayDataType,
  ObjectDataType,
  dataFetched,
  getWorkFlowById,
} from '@/store/workflow';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';

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

  const saveJSONFile = (data: ArrayDataType | ObjectDataType) => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(data?.data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute(
      'download',
      `${currentWorkflow?.name}.json`,
    );
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const saveCSVFile = (
    data: Array<{
      [key: string]: string | number | boolean;
    }>,
  ) => {
    const csv = Papa.unparse(data);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${currentWorkflow?.name}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col bg-slate-900 h-screen">
      <main className="flex flex-row h-100 h-screen">
        <aside className="w-14 hover:w-52 md:w-52 flex flex-col gap-2 p-2 !pr-0 ">
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
            {currentWorkflow && <Builder workflow={currentWorkflow} />}
          </div>
        </section>
      </main>
      <footer
        className={`${
          expandFooter ? 'h-40 md:h-60 p-2' : 'h-0'
        } transition-[height]  pt-0 overflow-auto`}
      >
        <div className="h-full bg-slate-700 rounded-md shadow p-4">
          {currentWorkflow?.currentData && (
            <pre className="h-full overflow-y-scroll relative">
              {currentWorkflow?.currentData && (
                <div className="flex gap-2 right-0 item-center absolute">
                  <Button
                    onClick={() => {
                      if (currentWorkflow?.currentData)
                        saveJSONFile(currentWorkflow.currentData);
                    }}
                  >
                    Download Json
                  </Button>
                  <Button
                    disabled={currentWorkflow?.currentData.type === 'object'}
                    onClick={() => {
                      if (
                        currentWorkflow.currentData &&
                        currentWorkflow?.currentData.type === 'array'
                      )
                        saveCSVFile(currentWorkflow?.currentData.data);
                    }}
                  >
                    Download CSV
                  </Button>
                </div>
              )}
              {JSON.stringify(currentWorkflow?.currentData.data, null, 2)}
            </pre>
          )}
        </div>
      </footer>
    </div>
  );
};

export default WorkFlow;
