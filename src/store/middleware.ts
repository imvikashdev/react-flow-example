import { Action, Middleware } from '@reduxjs/toolkit';

import { ReduxStore } from '.';
import { setWorkflow } from './workflow';
import { saveWorkflows } from '@/utils/db';

const saveWorkflowsMiddleware: Middleware =
  (storeApi) => (next) => async (action) => {
    next(action as Action<string>);

    if ((action as Action<string>).type === setWorkflow.type) {
      const state: ReduxStore = storeApi.getState();
      await saveWorkflows(state.workflow.workflows);
    }
  };

export default saveWorkflowsMiddleware;
