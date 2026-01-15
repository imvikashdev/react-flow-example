// import React from 'react';
import { Input } from '@/components/ui/input';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewWorkFlow from '@/components/core/Dialog/NewWorkFlow';
import { useDispatch, useSelector } from 'react-redux';
import { dataFetched, deleteWorkFlow, getWorkFlowList } from '@/store/workflow';
import { FaPen, FaTrash, FaSearch } from 'react-icons/fa';
import Loader from '@/components/core/Loader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Zap, FolderOpen } from 'lucide-react';

const Dashboard = () => {
  const dispatch = useDispatch();
  const workFLowList = useSelector(getWorkFlowList);
  const isLoading = useSelector(dataFetched);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-primary">
        <Loader />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] bg-background">
      {/* Sidebar */}
      <div className="hidden border-r border-border/50 bg-card/60 backdrop-blur-xl lg:block">
        <div className="flex h-full max-h-screen flex-col gap-4">
          <div className="flex h-16 items-center px-6 border-b border-border/50">
            <Link
              className="flex items-center gap-2 font-bold text-2xl"
              to={'/'}
            >
              <div className="p-1 rounded-lg bg-primary/20 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-foreground tracking-tight">FlowCraft</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-4 px-3">
            <nav className="grid items-start gap-2 text-sm font-medium">
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-muted-foreground hover:text-primary hover:bg-primary/10',
                  location.pathname === '/' && 'text-primary bg-primary/10',
                )}
                to={'/'}
              >
                <LayoutDashboard className="h-4 w-4" />
                Home
              </Link>
              <Link
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all text-muted-foreground hover:text-primary hover:bg-primary/10',
                  location.pathname === '/dashboard' &&
                    'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:text-primary-foreground hover:bg-primary/90',
                )}
                to={'/dashboard'}
              >
                <FolderOpen className="h-4 w-4" />
                Workflows
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b border-border/50 bg-card/60 backdrop-blur-xl px-6">
          <Link className="lg:hidden" to={'/'}>
            <Zap className="h-6 w-6 text-primary" />
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="w-full bg-secondary/50 border-transparent focus:border-primary pl-10 md:w-2/3 lg:w-1/3 rounded-full transition-all"
                  placeholder="Search workflows..."
                  type="search"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary" />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex flex-1 flex-col gap-8 p-6 lg:p-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workflows</h1>
              <p className="text-muted-foreground mt-1">
                Manage and edit your data workflows
              </p>
            </div>
            <NewWorkFlow />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {workFLowList.length > 0 ? (
              workFLowList.map((workflow) => (
                <Card
                  key={workflow.id}
                  className="group relative overflow-hidden border-border/50 bg-card/40 hover:bg-card/60 transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 block"
                >
                  <Link
                    to={`/workflow/${workflow.id}`}
                    className="absolute inset-0 z-10 cursor-pointer"
                  >
                    <span className="sr-only">
                      Open workflow {workflow.name}
                    </span>
                  </Link>
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardHeader className="pb-2">
                    <CardTitle
                      className="text-lg font-semibold truncate group-hover:text-primary transition-colors"
                      title={workflow.name}
                    >
                      {workflow.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      ID: {workflow.id.slice(0, 8)}...
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-end gap-2 relative z-20">
                      <Link to={`/workflow/${workflow.id}`} tabIndex={-1}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors cursor-pointer"
                        >
                          <FaPen className="h-3 w-3" />
                          <span className="sr-only">Edit {workflow.name}</span>
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent Link navigation
                          dispatch(deleteWorkFlow(workflow.id));
                        }}
                      >
                        <FaTrash className="h-3 w-3" />
                        <span className="sr-only">Delete {workflow.name}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/50 rounded-lg bg-card/20 text-center">
                <div className="p-4 rounded-full bg-secondary/50 mb-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No workflows created</h3>
                <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
                  Get started by creating a new workflow to visualize and
                  process your data.
                </p>
                {/* Reusing NewWorkFlow trigger might be tricky if it's a dialog trigger, sticking to the top one for now or just text */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
