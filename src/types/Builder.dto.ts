export const workflowNodeOptions = [
  'selectorNode',
  'sortNode',
  'filterNode',
  'sliceNode',
  'groupNode',
] as const;

export declare type workflowNodeTypes = (typeof workflowNodeOptions)[number];

export type csvDataArrayType = Array<{
  [key: string]: string | number | boolean;
}>;

export enum workflowNodeEnum {
  selectorNode = 'selectorNode',
  sortNode = 'sortNode',
  filterNode = 'filterNode',
  sliceNode = 'sliceNode',
  groupNode = 'groupNode',
}

export interface fileInputNodeType {
  nodeId: string;
  type: workflowNodeEnum.selectorNode;
  operationParams: null;
  columns: Array<string>;
  output: csvDataArrayType;
  input: null;
}

export interface sortNodeType {
  nodeId: string;
  type: workflowNodeEnum.sortNode;
  operationParams: {
    key: string;
    order: 'asc' | 'desc';
  };
  columns: Array<string>;
  output: csvDataArrayType;
  input: csvDataArrayType;
}

export interface sliceNodeType {
  nodeId: string;
  type: workflowNodeEnum.sliceNode;
  operationParams: {
    start: string;
    end: string;
  };
  columns: Array<string>;
  output: csvDataArrayType;
  input: csvDataArrayType;
}

export interface filterNodeType {
  nodeId: string;
  type: workflowNodeEnum.filterNode;
  operationParams: {
    key: string;
    value: string;
    isEqual: boolean;
    isRegex: boolean;
  };
  columns: Array<string>;
  output: csvDataArrayType;
  input: csvDataArrayType;
}

export interface groupNodeType {
  nodeId: string;
  type: workflowNodeEnum.groupNode;
  operationParams: {
    key: string;
  };
  output: {
    [key: string]: csvDataArrayType;
  };
  columns: Array<string>;
  input: csvDataArrayType;
}

export type NodeOperationTypes = Array<
  | fileInputNodeType
  | sortNodeType
  | sliceNodeType
  | filterNodeType
  | groupNodeType
>;
