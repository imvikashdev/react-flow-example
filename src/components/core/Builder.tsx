import React, { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  ReactFlowInstance,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuid } from 'uuid';
import InputNode from './Nodes/InputNode';
import { DragEventTypes } from '@/types/Builder';
import SortNode from './Nodes/SortNode';

const nodeTypes = {
  selectorNode: InputNode,
  sortNode: SortNode,
};

interface NodeData {
  label: string;
  color: string;
}

interface EdgeData {
  weight: number;
}

const Builder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<
    ReactFlowInstance<NodeData, EdgeData> | undefined
  >(undefined);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
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
      ) as DragEventTypes;

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

      switch (type) {
        case 'selectorNode':
          setNodes((nds) =>
            nds.concat({
              id: uuid(),
              type,
              position,
              data: { label: `${type} node` },
            }),
          );
          break;
        case 'sortNode':
          setNodes((nds) =>
            nds.concat({
              id: uuid(),
              type,
              position,
              data: { label: `${type} node` },
            }),
          );
          break;
      }
    },
    [reactFlowInstance, setNodes],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
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
