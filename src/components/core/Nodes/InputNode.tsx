import { memo, useCallback } from 'react';
import { Connection, Handle, NodeProps, Position } from 'reactflow';
import { FaGripVertical, FaFile } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import Papa from 'papaparse';
import {
  WorkFlowCSVData,
  addWorkFlowData,
  getNodeData,
  getNodeOperationData,
  removeCSVDataByNodeId,
  removeWorkFlowNode,
  updateNodeOperation,
} from '@/store/workflow';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxStore } from '@/store';
import { workflowNodeEnum } from '@/types/Builder.dto';
import { FileText } from 'lucide-react';

declare type Props = NodeProps & {
  data: {
    workflowId: string;
  };
};

const InputNode = memo((props: Props) => {
  const dispatch = useDispatch();

  const nodeOperations = useSelector((state: ReduxStore) =>
    getNodeOperationData(state, { workflowId: props.data.workflowId }),
  );

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
          columns: results.meta.fields || [],
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
      <div className="w-full">
        <div className="text-card-foreground flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border/50">
          <div className="flex gap-2 items-center">
            <FaGripVertical className="text-muted-foreground/50" />
            <span className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Input File
            </span>
          </div>
          <button
            onClick={() => removeNode(props.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <FaXmark />
          </button>
        </div>
        <div className="p-4">
          {file ? (
            <div className="bg-background border border-border/50 px-3 py-3 rounded-md flex flex-col gap-1">
              <h6 className="text-sm font-medium text-foreground">
                File selected
              </h6>
              <span className="text-xs text-muted-foreground truncate max-w-[250px]">
                {file.fileName}
              </span>
            </div>
          ) : (
            <div className="bg-background border border-dashed border-border px-4 py-6 rounded-md hover:bg-accent/50 transition-colors">
              <label
                className="cursor-pointer w-full h-full block"
                htmlFor={`file-upload-${props.id}`}
              >
                <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <FaFile className="text-2xl text-primary/50" />
                  <span className="text-sm">Upload CSV File</span>
                </div>
              </label>
              <input
                className="sr-only"
                id={`file-upload-${props.id}`}
                accept=".csv"
                onChange={onFileChange}
                type="file"
              />
            </div>
          )}
        </div>
      </div>
      <Handle
        className="!w-3 !h-6 !bg-primary !border-2 !border-background !rounded-full !-right-[6px]"
        type="source"
        onConnect={(params) => updateTargetNodeOperation(params)}
        isValidConnection={(connection) => {
          return connection.source !== connection.target;
        }}
        isConnectableEnd={false}
        isConnectableStart={true}
        position={Position.Right}
        id="data-source"
      />
    </div>
  );
});

export default InputNode;
