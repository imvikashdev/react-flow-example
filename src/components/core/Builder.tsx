import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
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
import ButtonEdge from './Edges/ButtonEdge';

const nodeTypes = {
  selectorNode: InputNode,
  sortNode: SortNode,
  filterNode: FilterNode,
  sliceNode: SliceNode,
  groupNode: GroupNode,
};

const edgeTypes = {
  buttonEdge: ButtonEdge,
};

declare type Props = {
  workflow: WorkFlowDto;
};

const Builder = ({ workflow }: Props) => {
  const dispatch = useDispatch();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance<Node, Edge> | undefined
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
              type: 'buttonEdge',
              data: { workflowId: workflow.id },
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
    <div className="h-full w-full text-foreground bg-slate-950">
      {' '}
      {/* Updated BG */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
        onConnect={onConnect}
        onInit={(e) => setReactFlowInstance(e)}
        onDrop={(e) => onDrop(e)}
        onDragOver={(e) => onDragOver(e)}
        // Removed hardcoded className to let parent control or default
      >
        <Controls className="border border-border/50 bg-card rounded-md shadow-md" />
        <MiniMap
          style={{
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            bottom: '60px',
            right: '16px',
          }}
          maskColor="rgba(0,0,0,0.6)"
          nodeColor="hsl(var(--primary))"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(var(--muted-foreground)/0.2)"
        />
      </ReactFlow>
    </div>
  );
};

export default Builder;
