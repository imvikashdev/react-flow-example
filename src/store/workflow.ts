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
  type?: string;
  data?: {
    workflowId: string;
    [key: string]: any;
  };
}

export interface ArrayDataType {
  data: Array<{
    [key: string]: string | number | boolean;
  }>;
  columns: Array<string>;
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

const demoWorkflow: WorkFlowDto = {
  id: 'demo-workflow-01',
  name: 'Demo Sales Analysis',
  nodeOperation: [],
  workFlowNodes: [
    {
      id: 'node-1',
      type: 'selectorNode',
      position: { x: 100, y: 100 },
      data: { workflowId: 'demo-workflow-01' },
    },
    {
      id: 'node-2',
      type: 'filterNode',
      position: { x: 100, y: 300 },
      data: { workflowId: 'demo-workflow-01' },
    },
    {
      id: 'node-3',
      type: 'sortNode',
      position: { x: 400, y: 300 },
      data: { workflowId: 'demo-workflow-01' },
    },
    {
      id: 'node-4',
      type: 'groupNode',
      position: { x: 400, y: 500 },
      data: { workflowId: 'demo-workflow-01' },
    },
    {
      id: 'node-5',
      type: 'sliceNode',
      position: { x: 700, y: 300 },
      data: { workflowId: 'demo-workflow-01' },
    },
  ],
  workFlowEdges: [
    {
      id: 'edge-1-2',
      source: 'node-1',
      sourceHandle: 'source-1',
      target: 'node-2',
      targetHandle: 'target-1',
      type: 'buttonEdge',
      data: { workflowId: 'demo-workflow-01' },
    },
    {
      id: 'edge-1-3',
      source: 'node-1',
      sourceHandle: 'source-1',
      target: 'node-3',
      targetHandle: 'target-1',
      type: 'buttonEdge',
      data: { workflowId: 'demo-workflow-01' },
    },
    {
      id: 'edge-3-4',
      source: 'node-3',
      sourceHandle: 'source-1',
      target: 'node-4',
      targetHandle: 'target-1',
      type: 'buttonEdge',
      data: { workflowId: 'demo-workflow-01' },
    },
    {
      id: 'edge-1-5',
      source: 'node-1',
      sourceHandle: 'source-1',
      target: 'node-5',
      targetHandle: 'target-1',
      type: 'buttonEdge',
      data: { workflowId: 'demo-workflow-01' },
    },
  ],
  data: [],
};

const initialState: WorkFlowState = {
  workflows: [demoWorkflow],
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

    updateWorkFlowNodePosition: (
      state,
      action: PayloadAction<{
        workflowId: string;
        nodeId: string;
        position: {
          x: number;
          y: number;
        };
      }>,
    ) => {
      const workflow = state.workflows.find(
        (flow) => flow.id === action.payload.workflowId,
      );
      if (workflow) {
        workflow.workFlowNodes = workflow.workFlowNodes.map((node) => {
          if (node.id === action.payload.nodeId) {
            return {
              ...node,
              position: action.payload.position,
            };
          }
          return node;
        });
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

    removeWorkFlowEdge: (
      state,
      action: PayloadAction<{ workflowId: string; edgeId: string }>,
    ) => {
      const workflow = state.workflows.find(
        (flow) => flow.id === action.payload.workflowId,
      );
      if (workflow) {
        workflow.workFlowEdges = workflow.workFlowEdges.filter(
          (edge) => edge.id !== action.payload.edgeId,
        );
      }
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
  updateWorkFlowNodePosition,
  setCurrentData,
  deleteWorkFlow,
  removeWorkFlowEdge,
} = WorkFlowSlice.actions;

export default WorkFlowSlice.reducer;
