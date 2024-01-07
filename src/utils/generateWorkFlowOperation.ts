import { WorkFlowNode } from '@/store/workflow';
import {
  filterNodeType,
  groupNodeType,
  sliceNodeType,
  sortNodeType,
  workflowNodeEnum,
  workflowNodeTypes,
} from '@/types/Builder.dto';

const generateWorkFlowOperation = (
  operation: workflowNodeTypes,
  nodeData: WorkFlowNode,
): sortNodeType | sliceNodeType | filterNodeType | groupNodeType | null => {
  switch (operation) {
    case 'sortNode':
      return {
        nodeId: nodeData.id,
        type: workflowNodeEnum.sortNode,
        operationParams: {
          key: 'select',
          order: 'asc',
        },
        columns: [],
        output: [],
        input: [],
      };
    case 'sliceNode':
      return {
        nodeId: nodeData.id,
        type: workflowNodeEnum.sliceNode,
        operationParams: {
          start: '',
          end: '',
        },
        columns: [],
        output: [],
        input: [],
      };
    case 'filterNode':
      return {
        nodeId: nodeData.id,
        type: workflowNodeEnum.filterNode,
        operationParams: {
          key: 'select',
          value: '',
          isEqual: true,
          isRegex: false,
        },
        columns: [],
        output: [],
        input: [],
      };
    case 'groupNode':
      return {
        nodeId: nodeData.id,
        type: workflowNodeEnum.groupNode,
        operationParams: {
          key: 'select',
        },
        columns: [],
        output: {},
        input: [],
      };
    default:
      return null;
  }
};

export { generateWorkFlowOperation };
