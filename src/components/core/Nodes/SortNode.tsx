import React, { memo } from 'react';
import { FaGripVertical } from 'react-icons/fa';
import { Handle, Position } from 'reactflow';

type Props = {
  isConnectable?: boolean;
};

const SortNode = memo(({ isConnectable }: Props) => {
  return (
    <div className="rounded-lg flex  shadow-md bg-slate-800">
      <Handle
        className="!rounded-l-md !rounded-r-none"
        type="target"
        position={Position.Left}
        style={{
          width: '16px',
          height: '28px',
          border: '0',
          left: '-15px',
          top: '20%',
        }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div className="shadow-md bg-slate-800 w-full max-w-sm">
        <div className="text-slate-300 flex gap-2 items-center px-2 py-1 bg-slate-600">
          <FaGripVertical className="inline" />
          <span className="text-sm">Sort Data</span>
        </div>
        <div className="dark:bg-slate-400 me-2 px-3 py-2 dark:text-white rounded-md">
          Sort Data
        </div>
      </div>
      <Handle
        className="!w-3 !relative !translate-x-0 !translate-y-0 !inset-0 !border-0 px-2 !rounded-l-none !rounded-r-md"
        style={{
          height: 'initial',
        }}
        type="source"
        position={Position.Right}
        id="a"
      />
    </div>
  );
});

export default SortNode;
