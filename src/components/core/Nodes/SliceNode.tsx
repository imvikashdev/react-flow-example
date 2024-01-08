import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReduxStore } from '@/store';
import {
  getNodeOperationData,
  removeCSVDataByNodeId,
  removeWorkFlowNode,
  setCurrentData,
  updateNodeOperation,
} from '@/store/workflow';
import { workflowNodeEnum } from '@/types/Builder.dto';
import { sliceData } from '@/utils/operations';
import { memo, useCallback, useState } from 'react';
import { FaGripVertical, FaPlay } from 'react-icons/fa';
import { FaTriangleExclamation, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Connection, Handle, NodeProps, Position } from 'reactflow';

declare type Props = NodeProps & {
  isConnectable: boolean;
  data: {
    workflowId: string;
  };
};

const SliceNode = memo((props: Props) => {
  const dispatch = useDispatch();
  const [startIndex, setStartIndex] = useState('0');
  const [endIndex, setEndIndex] = useState('10');

  const nodeOperations = useSelector((state: ReduxStore) =>
    getNodeOperationData(state, { workflowId: props.data.workflowId }),
  );

  const currentNodeOperation = nodeOperations?.find(
    (e) => e.nodeId === props.id,
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

  const runOperation = () => {
    if (
      currentNodeOperation &&
      currentNodeOperation.type === workflowNodeEnum.sliceNode
    ) {
      const slicedData = sliceData(
        currentNodeOperation.input,
        Number(startIndex),
        Number(endIndex),
      );
      dispatch(
        updateNodeOperation({
          workflowId: props.data.workflowId,
          nodeId: currentNodeOperation.nodeId,
          nodeOperation: { ...currentNodeOperation, output: slicedData },
        }),
      );
      dispatch(
        setCurrentData({
          workflowId: props.data.workflowId,
          data: { type: 'array', data: slicedData },
        }),
      );
    }
  };

  const updateTargetNodeOperation = useCallback(
    (params: Connection) => {
      const targetedNodeOperationData = nodeOperations?.find(
        (e) => e.nodeId === params.target,
      );
      const sourceNodeOperationData = nodeOperations?.find(
        (e) => e.nodeId === params.source,
      );
      if (
        sourceNodeOperationData &&
        params.source &&
        targetedNodeOperationData &&
        params.target &&
        targetedNodeOperationData.type !== workflowNodeEnum.selectorNode &&
        sourceNodeOperationData.type !== workflowNodeEnum.groupNode
      ) {
        console.log(
          sourceNodeOperationData.output,
          sourceNodeOperationData.columns,
        );
        dispatch(
          updateNodeOperation({
            workflowId: props.data.workflowId,
            nodeId: params.target,
            nodeOperation: {
              ...targetedNodeOperationData,
              input: sourceNodeOperationData.output,
              columns: sourceNodeOperationData.columns,
            },
          }),
        );
      }
    },
    [nodeOperations, dispatch, props.data.workflowId],
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
        isConnectableStart={false}
        isConnectableEnd={true}
        isConnectable={true}
      />
      <div className="shadow-md bg-slate-800 w-full max-w-sm">
        <div className="text-slate-300 flex items-center justify-between px-2 py-1 bg-slate-600">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="inline" />
            <span className="text-sm">Slice Data</span>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => removeNode(props.id)}>
              <FaXmark />
            </button>
            <button
              disabled={!currentNodeOperation?.input?.length}
              className="disabled:opacity-50 cursor-not-allowed"
              onClick={() => runOperation()}
            >
              <FaPlay />
            </button>
          </div>
        </div>
        <div className="dark:bg-slate-400 me-2 px-3 py-4 dark:text-white rounded-md">
          {currentNodeOperation?.input?.length &&
          currentNodeOperation?.input?.length > 0 ? (
            <>
              <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="startIndex" className="text-white">
                  Start Index
                </Label>
                <Input
                  type="text"
                  className="text-white bg-gray-700 border-0"
                  id="startIndex"
                  value={startIndex}
                  title="start index"
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setStartIndex(e.target.value);
                    }
                  }}
                  placeholder="0"
                />
              </div>
              <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="endIndex" className="text-white">
                  End Index
                </Label>
                <Input
                  type="text"
                  id="endIndex"
                  className="text-white bg-gray-700 border-0"
                  placeholder="Email"
                  title="end index"
                  value={endIndex}
                  onChange={(e) => {
                    if (!isNaN(Number(e.target.value))) {
                      setEndIndex(e.target.value);
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex gap-2 items-center">
              <FaTriangleExclamation className="text-red-400 inline" />
              <span className="text-white"> Please Connect Data Source</span>
            </div>
          )}
        </div>
      </div>
      <Handle
        className="!w-3 !relative !translate-x-0 !translate-y-0 !inset-0 !border-0 px-2 !rounded-l-none !rounded-r-md"
        style={{
          height: 'initial',
        }}
        type="source"
        position={Position.Right}
        isConnectableEnd={false}
        isValidConnection={(connection) => {
          return connection.source !== connection.target;
        }}
        isConnectableStart={true}
        onConnect={(params) => updateTargetNodeOperation(params)}
        id="a"
      />
    </div>
  );
});

export default SliceNode;
