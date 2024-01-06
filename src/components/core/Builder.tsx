import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

type Props = {};

const Builder = (props: Props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={(e) => onConnect(e)}
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
