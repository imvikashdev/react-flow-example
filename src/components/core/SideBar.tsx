import { workflowNodeTypes } from '@/types/Builder.dto';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { FaCheck, FaSave } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { getWorkFlowList } from '@/store/workflow';
import { saveWorkflows } from '@/utils/db';

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

  return (
    <div className="h-full w-full p-2">
      <div className="flex flex-col gap-4 my-3 ">
        <Button
          className="flex gap-2 items-center"
          onClick={() => {
            saveWorkflow();
          }}
        >
          {workflowSaved ? (
            <FaCheck className="text-green-500" />
          ) : (
            <FaSave className="text-white" />
          )}{' '}
          <span>{workflowSaved ? 'Saved' : 'Save Workflow'}</span>
        </Button>
        <div
          className="cursor-move border border-solid bg-indigo-950 border-gray-300 rounded-md px-4 text-white font-mono shadow-md py-2"
          onDragStart={(event) => onDragStart(event, 'selectorNode')}
          draggable
        >
          Input File
        </div>
        <div
          className="cursor-move border border-solid bg-indigo-950 border-gray-300 rounded-md px-4 text-white font-mono shadow-md py-2"
          onDragStart={(event) => onDragStart(event, 'sortNode')}
          draggable
        >
          Sort Data
        </div>
        <div
          className="cursor-move border border-solid bg-indigo-950 border-gray-300 rounded-md px-4 text-white font-mono shadow-md py-2"
          onDragStart={(event) => onDragStart(event, 'filterNode')}
          draggable
        >
          Filter Data
        </div>
        <div
          className="cursor-move border border-solid bg-indigo-950 border-gray-300 rounded-md px-4 text-white font-mono shadow-md py-2"
          onDragStart={(event) => onDragStart(event, 'sliceNode')}
          draggable
        >
          Slice Data
        </div>
        <div
          className="cursor-move border border-solid bg-indigo-950 border-gray-300 rounded-md px-4 text-white font-mono shadow-md py-2"
          onDragStart={(event) => onDragStart(event, 'groupNode')}
          draggable
        >
          Group Data
        </div>
      </div>
    </div>
  );
};

export default SideBar;
