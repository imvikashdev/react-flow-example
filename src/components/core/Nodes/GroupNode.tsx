import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReduxStore } from '@/store';
import {
  getNodeOperationData,
  removeCSVDataByNodeId,
  removeWorkFlowNode,
  setCurrentData,
  updateNodeOperation,
} from '@/store/workflow';
import { workflowNodeEnum } from '@/types/Builder.dto';
import { groupData } from '@/utils/operations';
import { memo, useCallback, useState } from 'react';
import { FaGripVertical, FaPlay } from 'react-icons/fa';
import { FaTriangleExclamation, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Handle, NodeProps, Position } from 'reactflow';
import { Layers } from 'lucide-react';

declare type Props = NodeProps & {
  isConnectable: boolean;
  data: {
    workflowId: string;
  };
};
const GroupNode = memo((props: Props) => {
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState('');

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
      currentNodeOperation.type === workflowNodeEnum.groupNode
    ) {
      const groupedData = groupData(currentNodeOperation.input, selectedKey);
      dispatch(
        updateNodeOperation({
          workflowId: props.data.workflowId,
          nodeId: currentNodeOperation.nodeId,
          nodeOperation: { ...currentNodeOperation, output: groupedData },
        }),
      );
      dispatch(
        setCurrentData({
          workflowId: props.data.workflowId,
          data: {
            type: 'object',
            data: groupedData,
          },
        }),
      );
    }
  };

  return (
    <div className="rounded-lg flex shadow-lg bg-card border border-border/50 overflow-hidden min-w-[300px]">
      <Handle
        className="!w-3 !h-6 !bg-primary !border-2 !border-background !rounded-full !-left-[6px]"
        type="target"
        position={Position.Left}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        isConnectableStart={false}
        isConnectableEnd={true}
        isConnectable={props.isConnectable}
      />
      <div className="w-full">
        <div className="text-card-foreground flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border/50">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="text-muted-foreground/50" />
            <span className="text-sm font-medium flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Group Data
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
            <div className="mb-4">
              <Select
                onValueChange={(e) => {
                  setSelectedKey(e);
                }}
                value={selectedKey}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Column" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {currentNodeOperation?.columns.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
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
    </div>
  );
});

export default GroupNode;
