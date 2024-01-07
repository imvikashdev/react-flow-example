import { memo, useCallback } from 'react';
import { Handle, NodeProps, Position, XYPosition } from 'reactflow';
import { FaGripVertical, FaFile } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import Papa from 'papaparse';
import {
  WorkFlowCSVData,
  addWorkFlowData,
  getNodeData,
  removeCSVDataByNodeId,
  removeWorkFlowNode,
} from '@/store/workflow';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStore } from '@/store';

declare type Props = NodeProps & {
  position?: XYPosition;
  data: {
    workflowId: string;
  };
};

const InputNode = memo((props: Props) => {
  const dispatch = useDispatch();
  const file = useSelector((state: ReduxStore) =>
    getNodeData(state, { workflowId: props.data.workflowId, nodeId: props.id }),
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      dispatch(
        removeWorkFlowNode({
          workflowId: props.data.workflowId,
          nodeId: nodeId,
        }),
      );
      dispatch(
        removeCSVDataByNodeId({ nodeId, workflowId: props.data.workflowId }),
      );
    },
    [dispatch, props.data.workflowId],
  );

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    const csvFile = event.target.files[0];
    Papa.parse(csvFile, {
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        const csvData = results.data as Array<{
          [key: string]: string | number | boolean;
        }>;

        const dataPayload: WorkFlowCSVData = {
          nodeId: props.id,
          csvData: csvData,
          fileName: csvFile.name,
        };

        dispatch(
          addWorkFlowData({
            data: dataPayload,
            workflowId: props.data.workflowId,
          }),
        );
      },
    });
  };

  return (
    <div className="rounded-lg flex  shadow-md bg-slate-800">
      <div className="shadow-md bg-slate-800 w-full max-w-sm">
        <div className="text-slate-300 flex items-center justify-between px-2 py-1 bg-slate-600">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="inline" />
            <span className="text-sm">File</span>
          </div>
          <button onClick={() => removeNode(props.id)}>
            <FaXmark />
          </button>
        </div>
        {file ? (
          <div className="dark:bg-slate-400 me-2 px-3 py-2 dark:text-white rounded-md">
            <h6 className="text-white">File selected</h6>
            <span className="text-gray-400">{file.fileName}</span>
          </div>
        ) : (
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
              onChange={onFileChange}
              type="file"
            />
          </div>
        )}
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

export default InputNode;
