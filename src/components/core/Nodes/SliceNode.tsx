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
import { Scissors } from 'lucide-react';

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
          data: {
            type: 'array',
            columns: currentNodeOperation.columns,
            data: slicedData,
          },
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
    <div className="rounded-lg flex shadow-lg bg-card border border-border/50 overflow-hidden min-w-[300px]">
      <Handle
        className="!w-3 !h-6 !bg-primary !border-2 !border-background !rounded-full !-left-[6px]"
        type="target"
        position={Position.Left}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        isConnectableStart={false}
        isConnectableEnd={true}
        isConnectable={true}
      />
      <div className="w-full">
        <div className="text-card-foreground flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border/50">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="text-muted-foreground/50" />
            <span className="text-sm font-medium flex items-center gap-2">
              <Scissors className="h-4 w-4 text-primary" />
              Slice Data
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => removeNode(props.id)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <FaXmark />
            </button>
            <button
              disabled={!currentNodeOperation?.input?.length}
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground p-1.5 rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => runOperation()}
            >
              <FaPlay className="text-[10px]" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {currentNodeOperation?.input?.length &&
          currentNodeOperation?.input?.length > 0 ? (
            <>
              <div className="mb-4 grid w-full items-center gap-1.5">
                <Label htmlFor="startIndex" className="">
                  Start Index
                </Label>
                <Input
                  type="text"
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
              <div className="mb-4 grid w-full items-center gap-1.5">
                <Label htmlFor="endIndex" className="">
                  End Index
                </Label>
                <Input
                  type="text"
                  id="endIndex"
                  placeholder="10"
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
            <div className="flex gap-2 items-center justify-center p-4 bg-muted/20 rounded-md border border-dashed border-border/50">
              <FaTriangleExclamation className="text-amber-500" />
              <span className="text-sm text-muted-foreground">
                Connect Data Source
              </span>
            </div>
          )}
        </div>
      </div>
      <Handle
        className="!w-3 !h-6 !bg-primary !border-2 !border-background !rounded-full !-right-[6px]"
        type="source"
        position={Position.Right}
        isConnectableEnd={false}
        isValidConnection={(connection) => {
          return connection.source !== connection.target;
        }}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        isConnectableStart={true}
        onConnect={(params) => updateTargetNodeOperation(params)}
        id="a"
      />
    </div>
  );
});

export default SliceNode;
