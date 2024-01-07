import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReduxStore } from '.';

export interface WorkFlowDto {
  id: string;
  name: string;
  workFlowNodes: [];
  workFlowEdges: [];
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

export const {
  setWorkflow,
  setWorkFlowFromDb,
  updateLoadingState,
  deleteWorkFlow,
} = WorkFlowSlice.actions;

export default WorkFlowSlice.reducer;
