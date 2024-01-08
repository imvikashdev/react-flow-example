import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReduxStore } from '.';

import { generateWorkFlowOperation } from '@/utils/generateWorkFlowOperation';
import {
  NodeOperationTypes,
  filterNodeType,
  groupNodeType,
  sliceNodeType,
  sortNodeType,
  workflowNodeEnum,
  workflowNodeTypes,
} from '@/types/Builder.dto';

export interface WorkFlowCSVData {
  nodeId: string;
  fileName: string;
  columns: Array<string>;
  csvData: Array<{
    [key: string]: string | number | boolean;
  }>;
}

export interface WorkFlowNode {
  id: string;
  type: workflowNodeTypes;
  position: {
    x: number;
    y: number;
  };
  data: {
    workflowId: string;
  };
}

export interface WorkFlowEdge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: null | string;
}

export interface ArrayDataType {
  data: Array<{
    [key: string]: string | number | boolean;
  }>;
  type: 'array';
}

export interface ObjectDataType {
  data: {
    [key: string]: Array<{
      [key: string]: string | number | boolean;
    }>;
  };
  type: 'object';
}

export interface WorkFlowDto {
  id: string;
  name: string;
  data?: Array<WorkFlowCSVData>;
  currentData?: ArrayDataType | ObjectDataType;
  nodeOperation: NodeOperationTypes;
  workFlowNodes: Array<WorkFlowNode>;
  workFlowEdges: Array<WorkFlowEdge>;
}

export interface WorkFlowState {
  loading: boolean;
  workflows: WorkFlowDto[];
}

const initialState: WorkFlowState = {
  workflows: [],
  loading: true,
};

const WorkFlowSlice = createSlice({
  name: 'workflow',
  initialState: initialState,
  reducers: {
    setWorkflow: (state, action: PayloadAction<WorkFlowDto>) => {
      state.workflows = [...state.workflows, action.payload];
    },

    setCurrentData: (
      state,
      action: PayloadAction<{
        workflowId: string;
        data: ArrayDataType | ObjectDataType;
      }>,
    ) => {
      const workflow = state.workflows.find(
        (flow) => flow.id === action.payload.workflowId,
      );
      if (workflow) {
        workflow.currentData = action.payload.data;
      }
    },

    addWorkFlowData: (
      state,
      action: PayloadAction<{ data: WorkFlowCSVData; workflowId: string }>,
    ) => {
      const { data, workflowId } = action.payload;
      const workflow = state.workflows.find((flow) => flow.id === workflowId);
      if (workflow) {
        workflow.data = [...(workflow?.data || []), data];

        const nodesOperationToBeUpdates = workflow.workFlowEdges
          .filter((edge) => edge.source === data.nodeId)
          .map((edge) => edge.target);

        console.log(nodesOperationToBeUpdates);

        const updatedOperationNodes: NodeOperationTypes =
          workflow.nodeOperation.map((operation) => {
            if (
              nodesOperationToBeUpdates.includes(operation.nodeId) &&
              operation.type !== workflowNodeEnum.selectorNode
            ) {
              return {
                ...operation,
                input: data.csvData,
                columns: data.columns,
              };
            } else {
              return operation;
            }
          });

        workflow.nodeOperation = [
          ...updatedOperationNodes,
          {
            nodeId: data.nodeId,
            type: workflowNodeEnum.selectorNode,
            operationParams: null,
            output: data.csvData,
            columns: data.columns,
            input: null,
          },
        ];
      }
    },

    removeCSVDataByNodeId: (
      state,
      payload: PayloadAction<{ workflowId: string; nodeId: string }>,
    ) => {
      const { workflowId, nodeId } = payload.payload;
      const workflow = state.workflows.find((flow) => flow.id === workflowId);
      if (workflow) {
        workflow.data = workflow.data?.filter((data) => data.nodeId !== nodeId);
      }
    },

    addWorkFlowNode: (
      state,
      action: PayloadAction<{
        workflowId: string;
        node: WorkFlowNode;
      }>,
    ) => {
      const workflow = state.workflows.find(
        (flow) => flow.id === action.payload.workflowId,
      );
      if (workflow) {
        workflow.workFlowNodes = [
          ...workflow.workFlowNodes,
          action.payload.node,
        ];
        const nodeOperationData = generateWorkFlowOperation(
          action.payload.node.type,
          action.payload.node,
        );
        if (nodeOperationData) {
          workflow.nodeOperation = [
            ...workflow.nodeOperation,
            nodeOperationData,
          ];
        }
      }
    },

    updateNodeOperation: (
      state,
      action: PayloadAction<{
        workflowId: string;
        nodeId: string;
        nodeOperation:
          | sortNodeType
          | filterNodeType
          | groupNodeType
          | sliceNodeType;
      }>,
    ) => {
      const workflow = state.workflows.find(
        (flow) => flow.id === action.payload.workflowId,
      );
      if (workflow) {
        workflow.nodeOperation = workflow.nodeOperation.map((operation) => {
          if (operation.nodeId === action.payload.nodeId) {
            return action.payload.nodeOperation;
          }
          return operation;
        });
      }
    },

    removeWorkFlowNode: (
      state,
      action: PayloadAction<{ workflowId: string; nodeId: string }>,
    ) => {
      const workflow = state.workflows.find(
        (flow) => flow.id === action.payload.workflowId,
      );
      if (workflow) {
        workflow.workFlowNodes = workflow.workFlowNodes.filter(
          (node) => node.id !== action.payload.nodeId,
        );
        workflow.nodeOperation = workflow.nodeOperation.filter(
          (operation) => operation.nodeId !== action.payload.nodeId,
        );
        workflow.workFlowEdges = workflow.workFlowEdges.filter(
          (edge) =>
            !(
              edge.source === action.payload.nodeId ||
              edge.target === action.payload.nodeId
            ),
        );
      }
    },

    addWorkFlowEdge: (
      state,
      action: PayloadAction<{ workflowId: string; edge: WorkFlowEdge }>,
    ) => {
      const workflow = state.workflows.find(
        (flow) => flow.id === action.payload.workflowId,
      );
      if (workflow) {
        workflow.workFlowEdges = [
          ...workflow.workFlowEdges,
          action.payload.edge,
        ];
      }
    },

    setWorkFlowFromDb: (state, action: PayloadAction<WorkFlowDto[]>) => {
      state.workflows = action.payload;
      state.loading = false;
    },

    updateLoadingState: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    deleteWorkFlow: (state, action: PayloadAction<string>) => {
      state.workflows = state.workflows.filter(
        (flow) => flow.id !== action.payload,
      );
    },
  },
});

export const getWorkFlowById = (state: ReduxStore, id: string) => {
  return state.workflow.workflows.find((flow) => flow.id === id);
};

export const dataFetched = (state: ReduxStore) => {
  return state.workflow.loading;
};

export const getWorkFlowList = (state: ReduxStore) => {
  return state.workflow.workflows;
};

export const getNodeData = (
  state: ReduxStore,
  {
    workflowId,
    nodeId,
  }: {
    workflowId: string;
    nodeId: string;
  },
) => {
  const workflow = state.workflow.workflows.find(
    (flow) => flow.id === workflowId,
  );
  if (workflow) {
    return workflow.data?.find((data) => data.nodeId === nodeId);
  }
};

export const getNodeOperationData = (
  state: ReduxStore,
  { workflowId }: { workflowId: string },
) => {
  const workflow = state.workflow.workflows.find(
    (flow) => flow.id === workflowId,
  );
  if (workflow) {
    return workflow.nodeOperation;
  }
};

export const getCurrentData = (state: ReduxStore, workflowId: string) => {
  const workflow = state.workflow.workflows.find(
    (flow) => flow.id === workflowId,
  );
  if (workflow) {
    return workflow.currentData;
  }
};

export const {
  setWorkflow,
  setWorkFlowFromDb,
  addWorkFlowEdge,
  addWorkFlowNode,
  removeWorkFlowNode,
  addWorkFlowData,
  updateLoadingState,
  removeCSVDataByNodeId,
  updateNodeOperation,
  setCurrentData,
  deleteWorkFlow,
} = WorkFlowSlice.actions;

export default WorkFlowSlice.reducer;
