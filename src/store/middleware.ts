import { Action, Middleware } from '@reduxjs/toolkit';

import { ReduxStore } from '.';
import { deleteWorkFlow, setWorkflow } from './workflow';
import { saveWorkflows } from '@/utils/db';

const workflowActions: string[] = [setWorkflow.type, deleteWorkFlow.type];

const saveWorkflowsMiddleware: Middleware =
  (storeApi) => (next) => async (action) => {
    next(action as Action<string>);

    if (workflowActions.includes((action as Action<string>).type)) {
      const state: ReduxStore = storeApi.getState();
      await saveWorkflows(state.workflow.workflows);
    }
  };

export default saveWorkflowsMiddleware;
