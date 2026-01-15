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
import { sortData } from '@/utils/operations';
import { memo, useCallback, useState } from 'react';
import { FaGripVertical } from 'react-icons/fa';
import { FaPlay, FaTriangleExclamation, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Connection, Handle, NodeProps, Position } from 'reactflow';
import { ArrowUpDown } from 'lucide-react';

declare type Props = NodeProps & {
  isConnectable: boolean;
  data: {
    workflowId: string;
  };
};
const SortNode = memo((props: Props) => {
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'dsc'>('asc');

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
      currentNodeOperation.type === workflowNodeEnum.sortNode
    ) {
      const sortedData = sortData(
        currentNodeOperation.input,
        selectedKey,
        sortOrder,
      );
      dispatch(
        updateNodeOperation({
          workflowId: props.data.workflowId,
          nodeId: currentNodeOperation.nodeId,
          nodeOperation: { ...currentNodeOperation, output: sortedData },
        }),
      );
      dispatch(
        setCurrentData({
          workflowId: props.data.workflowId,
          data: {
            type: 'array',
            columns: currentNodeOperation.columns,
            data: sortedData,
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
        id="target-sort"
        isConnectableStart={false}
        isConnectableEnd={true}
        isConnectable={true}
      />
      <div className="w-full">
        <div className="text-card-foreground flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border/50">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="text-muted-foreground/50" />
            <span className="text-sm font-medium flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-primary" />
              Sort Data
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
              <div className="mb-4">
                <Select
                  onValueChange={(e) => setSelectedKey(e)}
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
              <div>
                <Select
                  onValueChange={(e: 'asc' | 'dsc') => setSortOrder(e)}
                  value={sortOrder}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'asc'}> Ascending </SelectItem>
                      <SelectItem value={'dsc'}> Descending </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        onConnect={(params) => updateTargetNodeOperation(params)}
        isValidConnection={(connection) => {
          return connection.source !== connection.target;
        }}
        isConnectableEnd={false}
        isConnectableStart={true}
        position={Position.Right}
        id="a"
      />
    </div>
  );
});

export default SortNode;
