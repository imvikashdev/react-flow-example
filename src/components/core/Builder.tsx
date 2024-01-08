import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import { v4 as uuid } from 'uuid';
import { workflowNodeTypes } from '@/types/Builder.dto';
import {
  WorkFlowDto,
  addWorkFlowEdge,
  addWorkFlowNode,
  updateWorkFlowNodePosition,
} from '@/store/workflow';
import 'reactflow/dist/style.css';

import { useDispatch } from 'react-redux';
import InputNode from './Nodes/InputNode';
import SortNode from './Nodes/SortNode';
import FilterNode from './Nodes/FilterNode';
import SliceNode from './Nodes/SliceNode';
import GroupNode from './Nodes/GroupNode';

const nodeTypes = {
  selectorNode: InputNode,
  sortNode: SortNode,
  filterNode: FilterNode,
  sliceNode: SliceNode,
  groupNode: GroupNode,
};

declare type Props = {
  workflow: WorkFlowDto;
};

const Builder = ({ workflow }: Props) => {
  const dispatch = useDispatch();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance<any, any> | undefined
  >(undefined);

  const onConnect = useCallback(
    (params: Connection) => {
      const edgeExist = workflow.workFlowEdges.find(
        (e) => e.source === params.source && e.target === params.target,
      );

      if (params.source && params.target && params.sourceHandle && !edgeExist)
        dispatch(
          addWorkFlowEdge({
            workflowId: workflow.id,
            edge: {
              id: `reactflow__edge-${params.source}-${params.target}`,
              source: params.source,
              sourceHandle: params.sourceHandle,
              target: params.target,
              targetHandle: params.targetHandle,
            },
          }),
        );
    },
    [dispatch, workflow.id, workflow.workFlowEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        'application/reactflow',
      ) as workflowNodeTypes;

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      if (!reactFlowInstance) {
        return;
      }
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      dispatch(
        addWorkFlowNode({
          workflowId: workflow.id,
          node: {
            id: uuid(),
            type,
            position,
            data: {
              workflowId: workflow.id,
            },
          },
        }),
      );
    },
    [reactFlowInstance, workflow.id, dispatch],
  );

  useEffect(() => {
    setNodes(workflow.workFlowNodes);
  }, [workflow.workFlowNodes, setNodes]);

  useEffect(() => {
    setEdges(workflow.workFlowEdges);
  }, [workflow.workFlowEdges, setEdges]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDragStop={(_, node) => {
          dispatch(
            updateWorkFlowNodePosition({
              workflowId: workflow.id,
              nodeId: node.id,
              position: node.position,
            }),
          );
        }}
        onEdgesChange={onEdgesChange}
        onConnect={(e) => onConnect(e)}
        onInit={(e) => setReactFlowInstance(e)}
        onDrop={(e) => onDrop(e)}
        onDragOver={(e) => onDragOver(e)}
        className=" bg-indigo-950"
      >
        <Controls />
        <MiniMap
          className="bg-gray-700"
          style={{
            background: 'rgb(55 65 81)',
            border: '1px solid #777',
            borderRadius: '8px',
          }}
        />
        <Background variant={BackgroundVariant.Cross} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default Builder;
