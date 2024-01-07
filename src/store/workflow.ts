import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReduxStore } from '.';
import { workflowNodeTypes } from '@/types/Builder';

export interface WorkFlowCSVData {
  nodeId: string;
  fileName: string;
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

export interface WorkFlowDto {
  id: string;
  name: string;
  data?: Array<WorkFlowCSVData>;
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

    addWorkFlowData: (
      state,
      action: PayloadAction<{ data: WorkFlowCSVData; workflowId: string }>,
    ) => {
      const { data, workflowId } = action.payload;
      const workflow = state.workflows.find((flow) => flow.id === workflowId);
      if (workflow) {
        workflow.data = [...(workflow?.data || []), data];
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
      action: PayloadAction<{ workflowId: string; node: WorkFlowNode }>,
    ) => {
      const workflow = state.workflows.find(
        (flow) => flow.id === action.payload.workflowId,
      );
      if (workflow) {
        workflow.workFlowNodes = [
          ...workflow.workFlowNodes,
          action.payload.node,
        ];
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
        workflow.workFlowEdges = workflow.workFlowEdges.filter(
          (edge) => edge.source !== action.payload.nodeId,
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

export const {
  setWorkflow,
  setWorkFlowFromDb,
  addWorkFlowEdge,
  addWorkFlowNode,
  removeWorkFlowNode,
  addWorkFlowData,
  updateLoadingState,
  removeCSVDataByNodeId,
  deleteWorkFlow,
} = WorkFlowSlice.actions;

export default WorkFlowSlice.reducer;
