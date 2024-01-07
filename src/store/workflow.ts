import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ReduxStore } from '.';

export interface WorkFlowDto {
  id: string;
  name: string;
  workFlowNodes: [];
  workFlowEdges: [];
}

export interface WorkFlowState {
  workflows: WorkFlowDto[];
}

const initialState: WorkFlowState = {
  workflows: [],
};

const WorkFlowSlice = createSlice({
  name: 'workflow',
  initialState: initialState,
  reducers: {
    setWorkflow: (state, action: PayloadAction<WorkFlowDto>) => {
      state.workflows = [...state.workflows, action.payload];
    },
  },
});

export const getWorkFlowById = (state: ReduxStore, id: string) => {
  return state.workflow.workflows.find((flow) => flow.id === id);
};

export const getWorkFlowList = (state: ReduxStore) => {
  return state.workflow.workflows;
};

export const { setWorkflow } = WorkFlowSlice.actions;

export default WorkFlowSlice.reducer;
