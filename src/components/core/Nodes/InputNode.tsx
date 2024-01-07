import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { FaGripVertical, FaFile } from 'react-icons/fa';

type Props = {
  data: { onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void };
};

const InputNode = memo(({ data }: Props) => {
  return (
    <div className="rounded-lg flex  shadow-md bg-slate-800">
      <div className="shadow-md bg-slate-800 w-full max-w-sm">
        <div className="text-slate-300 flex gap-2 items-center px-2 py-1 bg-slate-600">
          <FaGripVertical className="inline" />
          <span className="text-sm">File</span>
        </div>
        <div className="dark:bg-slate-400 me-2 px-3 py-2 dark:text-white rounded-md">
          <label className="cursor-pointer" htmlFor="file-upload">
            <div className="flex items-center justify-center text-slate-300 py-2 px-3 rounded-md border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <FaFile className="mr-2 text-slate-300" />
              Upload File
            </div>
          </label>
          <input
            className="sr-only"
            id="file-upload"
            accept=".csv"
            // onChange={(e) => data.onFileSelect(e)}
            type="file"
          />
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
        // isConnectable={isConnectable}
      />
    </div>
  );
});

export default InputNode;
