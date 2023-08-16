import React, { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Connection,
  Edge,
} from "reactflow";

import "reactflow/dist/base.css";

import CustomNode from "@/components/CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

function NodeDiagram({
  initNodes,
  initEdges,
  setNodeId,
}: {
  initNodes: any;
  initEdges: any;
  setNodeId: any;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  // const [nodeId, setNodeId] = useState("1");
  const [nodeDescription, setNodeDescription] = useState("Node 1");
  const [nodeBg, setNodeBg] = useState("#eee");
  const [nodeHidden, setNodeHidden] = useState(false);

  // useEffect(() => {
  //   setNodes((nds) =>
  //     nds.map((node) => {
  //       if (node.id === "1") {
  //         // it's important that you create a new object here
  //         // in order to notify react flow about the change
  //         node.data = {
  //           ...node.data,
  //           description: nodeDescription,
  //         };
  //       }

  //       return node;
  //     })
  //   );
  //   console.log("🚀 ~ file: NodeDiagram.tsx:107 ~ NodeDiagram ~ nodes:", nodes);
  // }, [nodeDescription, setNodes]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const proOptions = { hideAttribution: true };
  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        fitView
        onNodeClick={(evt, node) => {
          setNodeId(node.id);
        }}
        className="bg-teal-50"
      >
        <Controls />
      </ReactFlow>
      {/* <div className="absolute top-0 right-0">
        <label>label:</label>
        <input
          value={nodeDescription}
          onChange={(evt) => {
            console.log(
              "🚀 ~ file: NodeDiagram.tsx:155 ~ NodeDiagram ~ evt:",
              evt
            );

            setNodeDescription(evt.target.value);
          }}
        />
      </div> */}
    </>
  );
}

export default NodeDiagram;
