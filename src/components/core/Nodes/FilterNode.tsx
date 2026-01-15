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
import { Filter } from 'lucide-react';

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
            columns: currentNodeOperation.columns,
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
    <div className="rounded-lg flex shadow-lg bg-card border border-border/50 overflow-hidden min-w-[320px]">
      <Handle
        className="!w-3 !h-6 !bg-primary !border-2 !border-background !rounded-full !-left-[6px]"
        type="target"
        position={Position.Left}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        isConnectableEnd={true}
        isConnectableStart={false}
        isConnectable={props.isConnectable}
      />
      <div className="w-full">
        <div className="text-card-foreground flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border/50">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="text-muted-foreground/50" />
            <span className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Filter Data
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
                  onValueChange={(e) => {
                    setSelectedKey(e);
                    setValue('');
                    setFilterType('string');
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
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder="Filter Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="capitalize">
                          {filterTypesOptions.map((e) => (
                            <SelectItem
                              className="capitalize"
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
                      <Label
                        htmlFor="invert"
                        className="text-sm font-medium mb-2 block"
                      >
                        Invert Result
                      </Label>
                      <div className="flex gap-4 items-center bg-background border border-border/50 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            className="accent-primary"
                            id="invert-yes"
                            name="invert"
                            checked={invert}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInvert(true);
                              }
                            }}
                          />
                          <Label
                            htmlFor="invert-yes"
                            className="cursor-pointer"
                          >
                            Yes
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            className="accent-primary"
                            id="invert-no"
                            name="invert"
                            checked={!invert}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setInvert(false);
                              }
                            }}
                          />
                          <Label htmlFor="invert-no" className="cursor-pointer">
                            No
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}
                  {filterType && (
                    <div className="mb-4 grid w-full items-center gap-1.5">
                      <Label htmlFor="startIndex" className="">
                        Filter Value
                      </Label>
                      <Input
                        type="text"
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
        isValidConnection={(connection) => {
          return connection.source !== connection.target;
        }}
        onConnect={(params) => updateTargetNodeOperation(params)}
        isConnectableEnd={false}
        isConnectableStart={true}
        position={Position.Right}
        id="a"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
});

export default FilterNode;
