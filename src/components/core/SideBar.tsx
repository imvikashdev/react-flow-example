import { workflowNodeTypes } from '@/types/Builder.dto';
import { useState } from 'react';
import { Button } from '../ui/button';
import { FaCheck, FaSave } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { getWorkFlowList } from '@/store/workflow';
import { saveWorkflows } from '@/utils/db';
import { FileText, ArrowUpDown, Filter, Scissors, Layers } from 'lucide-react';

const SideBar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: workflowNodeTypes,
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const [workflowSaved, setWorkflowSaved] = useState(false);

  const latestWorkflows = useSelector(getWorkFlowList);

  const saveWorkflow = async () => {
    try {
      const result = await saveWorkflows(latestWorkflows);
      if (result) {
        setWorkflowSaved(true);
        setTimeout(() => {
          setWorkflowSaved(false);
        }, 2000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const DraggableNode = ({
    type,
    label,
    icon: Icon,
  }: {
    type: workflowNodeTypes;
    label: string;
    icon: any;
  }) => (
    <div
      className="cursor-move group flex items-center gap-3 border border-border/50 bg-card hover:bg-accent/50 hover:border-primary/50 rounded-lg px-3 py-3 text-sm font-medium transition-all shadow-sm hover:shadow-md"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <div className="p-1.5 rounded-md bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <span className="truncate">{label}</span>
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col gap-4">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Actions
        </h2>
        <Button
          className="w-full flex gap-2 items-center justify-center transition-all"
          size="sm"
          onClick={() => {
            saveWorkflow();
          }}
        >
          {workflowSaved ? (
            <FaCheck className="h-3 w-3" />
          ) : (
            <FaSave className="h-3 w-3" />
          )}{' '}
          <span>{workflowSaved ? 'Saved' : 'Save Workflow'}</span>
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-2">
          Nodes
        </h2>
        <DraggableNode type="selectorNode" label="Input File" icon={FileText} />
        <DraggableNode type="sortNode" label="Sort Data" icon={ArrowUpDown} />
        <DraggableNode type="filterNode" label="Filter Data" icon={Filter} />
        <DraggableNode type="sliceNode" label="Slice Data" icon={Scissors} />
        <DraggableNode type="groupNode" label="Group Data" icon={Layers} />
      </div>
    </div>
  );
};

export default SideBar;
