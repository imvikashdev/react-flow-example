import { configureStore } from '@reduxjs/toolkit';
import WorkFlowReducer, { WorkFlowState } from './workflow';

export interface ReduxStore {
  workflow: WorkFlowState;
}

export const store = configureStore({
  reducer: {
    workflow: WorkFlowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
