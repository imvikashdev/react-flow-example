export const DragEventOptions = [
  'input',
  'selectorNode',
  'sortNode',
  'output',
  'input-output',
  'none',
] as const;

export declare type DragEventTypes = (typeof DragEventOptions)[number];
