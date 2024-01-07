import { workflowNodeTypes } from '@/types/Builder';
import React from 'react';

const SideBar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: workflowNodeTypes,
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full w-full p-2">
      <div className="flex flex-col gap-4 my-3 ">
        <div
          className="cursor-move border border-solid bg-indigo-950 border-gray-300 rounded-md px-4 text-white font-mono shadow-md py-2"
          onDragStart={(event) => onDragStart(event, 'selectorNode')}
          draggable
        >
          Input Node
        </div>
        <div
          className="cursor-move border border-solid bg-indigo-950 border-gray-300 rounded-md px-4 text-white font-mono shadow-md py-2"
          onDragStart={(event) => onDragStart(event, 'sortNode')}
          draggable
        >
          Sort Node
        </div>
      </div>
    </div>
  );
};

export default SideBar;
