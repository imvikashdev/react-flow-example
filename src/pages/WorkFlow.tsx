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
import { Navigate, useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import { DataTable } from '@/components/core/Table';
import {
  ChevronUp,
  ChevronDown,
  Download,
  FileJson,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const WorkFlow = () => {
  const [expandFooter, setExpandFooter] = useState(false);
  const { workflowId } = useParams<{ workflowId: string }>();
  const currentWorkflow = useSelector((state: ReduxStore) =>
    getWorkFlowById(state, workflowId || ''),
  );
  const isLoading = useSelector(dataFetched);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader />
      </div>
    );
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
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header - Compact for Workflow */}
      <header className="h-14 border-b border-border/50 bg-card/50 flex items-center px-4 justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Zap className="h-5 w-5" />
            <span className="font-semibold text-sm">FlowCraft</span>
          </Link>
          <div className="h-4 w-[1px] bg-border/50" />
          <h1 className="text-sm font-medium">{currentWorkflow?.name}</h1>
        </div>
        {/* Styling placeholders for potential actions like settings or user profile */}
        <div className="flex items-center gap-2"></div>
      </header>

      <main className="flex flex-row flex-1 overflow-hidden relative">
        <aside className="w-16 hover:w-64 md:w-64 flex flex-col gap-2 p-2 border-r border-border/50 bg-card/30 transition-all duration-300 z-40">
          <div className="flex-grow overflow-y-auto">
            <SideBar />
          </div>
        </aside>
        <section className="flex-grow relative bg-slate-950/50">
          <div className="absolute inset-0">
            {currentWorkflow && <Builder workflow={currentWorkflow} />}
          </div>
        </section>
      </main>

      {/* Footer / Data Panel */}
      <footer
        className={cn(
          'border-t border-border/50 bg-card/80 backdrop-blur-lg flex flex-col transition-all duration-300 absolute bottom-0 w-full z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] overflow-hidden',
          expandFooter ? 'h-96' : 'h-10',
        )}
      >
        <div
          className="h-10 flex items-center justify-between px-4 cursor-pointer hover:bg-accent/50 transition-colors shrink-0"
          onClick={() => setExpandFooter(!expandFooter)}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Download className="h-4 w-4" /> Output Data
          </span>
          {expandFooter ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-4 pt-4 gap-4">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <h3 className="text-sm font-medium">Result Preview</h3>
            {currentWorkflow?.currentData && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => {
                    if (currentWorkflow?.currentData)
                      saveJSONFile(currentWorkflow.currentData);
                  }}
                >
                  <FileJson className="h-3 w-3" /> JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2"
                  disabled={currentWorkflow?.currentData.type === 'object'}
                  onClick={() => {
                    if (
                      currentWorkflow.currentData &&
                      currentWorkflow?.currentData.type === 'array'
                    )
                      saveCSVFile(currentWorkflow?.currentData.data);
                  }}
                >
                  <FileSpreadsheet className="h-3 w-3" /> CSV
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-auto bg-background/50 rounded-md border border-border/50 p-2">
            {currentWorkflow?.currentData ? (
              currentWorkflow.currentData.type === 'array' ? (
                <DataTable
                  data={currentWorkflow?.currentData.data || []}
                  columns={currentWorkflow.currentData.columns || []}
                />
              ) : (
                <pre className="text-xs font-mono p-2">
                  {JSON.stringify(currentWorkflow?.currentData.data, null, 2)}
                </pre>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <p className="text-sm">No data generated yet.</p>
                <p className="text-xs">Run the workflow to see results here.</p>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkFlow;
