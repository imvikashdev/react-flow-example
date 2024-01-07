import { configureStore } from '@reduxjs/toolkit';
import WorkFlowReducer, { WorkFlowState } from './workflow';
import saveWorkflowsMiddleware from './middleware';

export interface ReduxStore {
  workflow: WorkFlowState;
}

export const store = configureStore({
  reducer: {
    workflow: WorkFlowReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(saveWorkflowsMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
