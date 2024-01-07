import { DragEventTypes } from '@/types/Builder';
import React from 'react';

type Props = {};

const SideBar = (props: Props) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: DragEventTypes,
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full w-full p-2">
      <div className="flex flex-column gap-3">
        <div
          className="dndnode input"
          onDragStart={(event) => onDragStart(event, 'selectorNode')}
          draggable
        >
          Input Node
        </div>
        <div
          className="dndnode input"
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
