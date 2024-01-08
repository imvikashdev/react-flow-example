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
        isConnectableStart={false}
        isConnectableEnd={true}
        isConnectable={props.isConnectable}
      />
      <div className="shadow-md bg-slate-800 w-full max-w-sm">
        <div className="text-slate-300 flex items-center justify-between px-2 py-1 bg-slate-600">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="inline" />
            <span className="text-sm">Group Data</span>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => removeNode(props.id)}>
              <FaXmark />
            </button>
            <button
              disabled={!currentNodeOperation?.input?.length}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => runOperation()}
            >
              <FaPlay />
            </button>
          </div>
        </div>
        <div className="dark:bg-slate-400 me-2 px-3 py-4 dark:text-white rounded-md">
          {currentNodeOperation?.input?.length &&
          currentNodeOperation?.input?.length > 0 ? (
            <div className="mb-4">
              <Select
                onValueChange={(e) => {
                  setSelectedKey(e);
                }}
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
          ) : (
            <div className="flex gap-2 items-center">
              <FaTriangleExclamation className="text-red-400 inline" />
              <span className="text-white"> Please Connect Data Source</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default GroupNode;
