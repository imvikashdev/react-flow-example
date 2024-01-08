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
import { FaPlay, FaXmark } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { Connection, Handle, NodeProps, Position } from 'reactflow';

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
          data: { type: 'array', data: sortedData },
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
        id="target-sort"
        onConnect={(params) => {
          console.log('handle onConnect', params);
        }}
        isConnectableStart={false}
        isConnectableEnd={true}
        isConnectable={true}
      />
      <div className="shadow-md bg-slate-800 w-full max-w-sm">
        <div className="text-slate-300 flex items-center justify-between px-2 py-1 bg-slate-600">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="inline" />
            <span className="text-sm">Sort Data</span>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => removeNode(props.id)}>
              <FaXmark />
            </button>
            <button onClick={() => runOperation()}>
              <FaPlay />
            </button>
          </div>
        </div>
        <div className="dark:bg-slate-400 me-2 px-3 py-4 dark:text-white rounded-md">
          <div className="mb-4">
            <Select
              onValueChange={(e) => setSelectedKey(e)}
              value={selectedKey}
            >
              <SelectTrigger className="w-[180px] bg-gray-700 border-0 text-white">
                <SelectValue placeholder="Select Column" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-gray-700 text-white border-0 outline-none">
                  {currentNodeOperation?.columns.map((e) => (
                    <SelectItem
                      className="cursor-pointer !bg-gray-700 hover:bg-gray-700 !text-white"
                      key={e}
                      value={e}
                    >
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
              <SelectTrigger className="w-[180px] bg-gray-700 border-0 text-white">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className="bg-gray-700 text-white !border-0 !outline-none">
                  <SelectItem
                    className="cursor-pointer !bg-gray-700 hover:bg-gray-700 !text-white"
                    value={'asc'}
                  >
                    Ascending
                  </SelectItem>
                  <SelectItem
                    className="cursor-pointer !bg-gray-700 hover:bg-gray-700 !text-white"
                    value={'dsc'}
                  >
                    Descending
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <Handle
        className="!w-3 !relative !translate-x-0 !translate-y-0 !inset-0 !border-0 px-2 !rounded-l-none !rounded-r-md"
        style={{
          height: 'initial',
        }}
        type="source"
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
