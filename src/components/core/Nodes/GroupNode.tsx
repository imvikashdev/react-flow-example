import { removeCSVDataByNodeId, removeWorkFlowNode } from '@/store/workflow';
import { memo, useCallback } from 'react';
import { FaGripVertical } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { Handle, NodeProps, Position } from 'reactflow';

declare type Props = NodeProps & {
  isConnectable: boolean;
  data: {
    workflowId: string;
  };
};
const GroupNode = memo((props: Props) => {
  const dispatch = useDispatch();

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
        isValidConnection={(connection) => {
          console.log(connection);
          return true;
        }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={props.isConnectable}
      />
      <div className="shadow-md bg-slate-800 w-full max-w-sm">
        <div className="text-slate-300 flex items-center justify-between px-2 py-1 bg-slate-600">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="inline" />
            <span className="text-sm">Group Data</span>
          </div>
          <button onClick={() => removeNode(props.id)}>
            <FaXmark />
          </button>
        </div>
        <div className="dark:bg-slate-400 me-2 px-3 py-2 dark:text-white rounded-md">
          Group Data
        </div>
      </div>
      {/* <Handle
        className="!w-3 !relative !translate-x-0 !translate-y-0 !inset-0 !border-0 px-2 !rounded-l-none !rounded-r-md"
        style={{
          height: 'initial',
        }}
        type="source"
        position={Position.Right}
        id="a"
      /> */}
    </div>
  );
});

export default GroupNode;
