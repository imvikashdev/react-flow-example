import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
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
import {
  filterTypes,
  filterTypesOptions,
  workflowNodeEnum,
} from '@/types/Builder.dto';
import { filterData } from '@/utils/operations';
import { Select } from '@radix-ui/react-select';
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
const FilterNode = memo((props: Props) => {
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState('');
  const [filterType, setFilterType] = useState<filterTypes>('string');
  const [invert, setInvert] = useState(false);
  const [value, setValue] = useState('');
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
      currentNodeOperation.type === workflowNodeEnum.filterNode
    ) {
      const filteredData = filterData(
        currentNodeOperation.input,
        filterType,
        selectedKey,
        value,
        invert,
      );
      dispatch(
        updateNodeOperation({
          workflowId: props.data.workflowId,
          nodeId: currentNodeOperation.nodeId,
          nodeOperation: { ...currentNodeOperation, output: filteredData },
        }),
      );
      dispatch(
        setCurrentData({
          workflowId: props.data.workflowId,
          data: {
            type: 'array',
            data: filteredData,
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
        isConnectableEnd={true}
        isConnectableStart={false}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={props.isConnectable}
      />
      <div className="shadow-md bg-slate-800 w-full max-w-sm">
        <div className="text-slate-300 flex items-center justify-between px-2 py-1 bg-slate-600">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="inline" />
            <span className="text-sm">Filter Data</span>
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
              <div className="mb-4">
                <Select
                  onValueChange={(e) => {
                    setSelectedKey(e);
                    setValue('');
                    setFilterType('string');
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
              {selectedKey && (
                <>
                  <div className="mb-4">
                    <Select
                      onValueChange={(e: filterTypes) => {
                        setFilterType(e);
                        setValue('');
                      }}
                      value={filterType}
                    >
                      <SelectTrigger className="w-[180px] capitalize bg-gray-700 border-0 text-white">
                        <SelectValue placeholder="Filter Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="bg-gray-700 capitalize text-white border-0 outline-none">
                          {filterTypesOptions.map((e) => (
                            <SelectItem
                              className="capitalize cursor-pointer !bg-gray-700 hover:bg-gray-700 !text-white"
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
                  {(filterType === 'string' ||
                    filterType === 'number' ||
                    filterType === 'contains') && (
                    <div className="mb-4">
                      <Label htmlFor="invert" className="text-white">
                        Invert
                      </Label>
                      <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            className="text-white bg-gray-700 border-0"
                            id="invert-yes"
                            name="invert"
                            checked={invert}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInvert(true);
                              }
                            }}
                          />
                          <Label htmlFor="invert-yes" className="text-white">
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            className="text-white bg-gray-700 border-0"
                            id="invert-no"
                            name="invert"
                            checked={!invert}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInvert(false);
                              }
                            }}
                          />
                          <Label htmlFor="invert-no" className="text-white">
                            No
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                  {filterType && (
                    <div className="mb-4 grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="startIndex" className="text-white">
                        Filter Value
                      </Label>
                      <Input
                        type="text"
                        className="text-white bg-gray-700 border-0"
                        id="startIndex"
                        value={value}
                        title="filter value"
                        onChange={(e) => {
                          if (
                            filterType === 'number' ||
                            filterType === 'greater-than' ||
                            filterType === 'less-than'
                          ) {
                            if (!isNaN(Number(e.target.value))) {
                              setValue(e.target.value);
                            }
                          } else {
                            setValue(e.target.value);
                          }
                        }}
                      />
                    </div>
                  )}
                </>
              )}
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
        isValidConnection={(connection) => {
          return connection.source !== connection.target;
        }}
        onConnect={(params) => updateTargetNodeOperation(params)}
        isConnectableEnd={false}
        isConnectableStart={true}
        position={Position.Right}
        id="a"
      />
    </div>
  );
});

export default FilterNode;
