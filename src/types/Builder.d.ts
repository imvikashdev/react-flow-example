export const workflowNodeOptions = [
  'input',
  'selectorNode',
  'sortNode',
  'output',
  'input-output',
  'none',
] as const;

export declare type workflowNodeTypes = (typeof DragEventOptions)[number];
