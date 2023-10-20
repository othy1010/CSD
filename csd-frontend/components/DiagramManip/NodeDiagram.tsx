import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Connection,
  Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/base.css";

import CustomNode from "@/components/DiagramManip/NodeTypes/CustomNode";
import CustomFloatingEdge from "./floatingedge/CustomEdge";
import FloatingConnectionLine from "./floatingedge/FloatingConnectionLine";
import { Button } from "@chakra-ui/react";
import { FaFolderPlus } from "react-icons/fa";
import { FcFolder, FcRefresh } from "react-icons/fc";
import ContextMenu from "./contextMenu";
import { getVulnerabilities } from "../ApiQueries";
import { GetServerSidePropsContext } from "next";
import { GiBorderedShield } from "react-icons/gi";
import VulnerabilityNode from "./NodeTypes/VulnerabilityNode";
import RiskNode from "./NodeTypes/RiskNode";

const nodeTypes = {
  custom: CustomNode,
  risk: RiskNode,
  threat: VulnerabilityNode,
  vulnerability: VulnerabilityNode,
};

const edgeTypes = {
  custom: CustomFloatingEdge,
};

function NodeDiagram({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodeId,
  setEdges,
  setNodes,
}: {
  nodes: any;
  edges: any;
  onNodesChange: any;
  onEdgesChange: any;
  setNodeId: any;
  setEdges: any;
  setNodes: any;
}) {
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((els: Edge[]) => addEdge(params, els)),
    [setEdges]
  );

  const onNodeContextMenu = useCallback(
    (
      event: { preventDefault: () => void; clientY: number; clientX: number },
      node: { id: any }
    ) => {
      // Prevent native context menu from showing
      event.preventDefault();

      // Calculate position of the context menu. We want to make sure it
      // doesn't get positioned off-screen.
      if (ref.current) {
        const pane = ref.current.getBoundingClientRect();
        console.log("🚀 ~ file: NodeDiagram.tsx:70 ~ node:", node);
        setMenu({
          id: node.id,
          top: event.clientY < pane.height - 200 && 100,
          left: event.clientX < pane.width - 200 && event.clientX,
          right: event.clientX >= pane.width - 200 && 200,
          bottom:
            event.clientY >= pane.height - 200 && pane.height - event.clientY,
        });
        console.log(
          "🚀 ~ file: NodeDiagram.tsx:74 ~ pane.width - event.clientX:",
          pane.width - event.clientX
        );
        console.log(
          "🚀 ~ file: NodeDiagram.tsx:74 ~ event.clientX >= pane.width - 200:",
          event.clientX >= pane.width - 200
        );
        console.log("🚀 ~ file: NodeDiagram.tsx:48 ~ menu:", menu);
      }
    },
    [setMenu]
  );

  // Close the context menu if it's open whenever the window is clicked.
  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  const proOptions = { hideAttribution: true };
  return (
    <>
      <div className="">
        <svg
          style={{ position: "absolute", top: 0, left: 0 }}
          className="h-0 w-0 "
        >
          <defs>
            <marker
              id="compositionSVG"
              viewBox="0 0 20 40"
              markerHeight={20}
              markerWidth={20}
              refX={10}
              refY={20}
            >
              <path fill="black" d="M3,10 L10,0 L17,10 L10,20 L3,10" />
            </marker>
          </defs>
        </svg>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: 0, left: 0 }}
          className="h-0 w-0 "
        >
          <defs>
            <marker
              id="InheritanceSVG"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              viewBox="0 0 20 40"
              markerHeight={20}
              markerWidth={20}
              refX={12}
              refY={20}
            >
              <path d="M10.24 20.043l-8.422 -14.06a1.989 1.989 0 0 1 1.7 -2.983h16.845a1.989 1.989 0 0 1 1.7 2.983l-8.422 14.06a1.989 1.989 0 0 1 -3.4 0z"></path>
            </marker>
          </defs>
        </svg>
      </div>
      <ReactFlow
        ref={ref}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        connectionLineComponent={FloatingConnectionLine}
        proOptions={proOptions}
        fitView
        minZoom={0.2}
        onNodeClick={(evt, node) => {
          setNodeId(node.id);
        }}
        className="bg-teal-50"
      >
        <div className="flex flex-col bg-white rounded-lg absolute top-0 right-0 m-2 border-2 z-10">
          <div
            className="flex gap-2 p-1 flex-row  items-center border-b-2 cursor-pointer"
            onClick={() => {
              setNodes((nodes: any) => [
                ...nodes,
                {
                  id: "class" + nodes.length,
                  type: "custom",
                  name: "new class",
                  sourcePosition: "right",
                  targetPosition: "left",
                  data: {
                    name: "new class",
                    label: "new class",
                    fields: [],
                  },
                  position: {
                    x: 100,
                    y: 100,
                  },
                },
              ]);
            }}
          >
            <FcFolder />
            add a new Class
          </div>
          <div
            className="flex gap-2 p-1 flex-row items-center border-b-2 cursor-pointer"
            onClick={() => {}}
          >
            <GiBorderedShield />
            Security Mode
          </div>
          <div
            className="flex gap-2 p-1 flex-row items-center cursor-pointer"
            onClick={() => {
              setNodes([]);
              setEdges([]);
            }}
          >
            <FcRefresh />
            reset
          </div>
        </div>
        <Controls />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
    </>
  );
}

export default NodeDiagram;
