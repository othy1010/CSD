import { report } from "process";
import React, { useCallback, useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import { getCollaboration, getVulnerabilities } from "../ApiQueries";
import { GetServerSidePropsContext } from "next";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { BsBugFill, BsExclamationCircleFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { HiDuplicate } from "react-icons/hi";
import { FaShieldVirus } from "react-icons/fa";
export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  vulnerabilities,
  ...props
}: any) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  const reportRisk = useCallback(() => {
    const node = getNode(id);

    const riskNodeId = `${id}-risk${Math.random()}`; // unique ID for the risk node
    const riskEdgeId = `${id}-${id}-risk`;

    setNodes((prevNodes) => {
      // Toggle isVulnerable for the existing node
      const toggledNodes = prevNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              isRisk: true,
            },
          };
        }
        return node;
      });

      // Add the new risk node
      const newRiskNode = {
        id: riskNodeId,
        type: "risk",
        data: { label: "Risk Node", content: "Risk content" },
        position: {
          x: node.position.x,
          y: node.position.y - 250,
        },
      };

      return [...toggledNodes, newRiskNode];
    });

    setEdges((prevEdges) => {
      const newEdge = {
        id: riskEdgeId,
        target: id,
        source: riskNodeId,
        type: "smoothstep",
        style: {
          strokeWidth: 2,
          stroke: "#000000",
        },
        animated: true,
        label: "has risk of",
      };

      return [...prevEdges, newEdge];
    });
  }, [id, getNode, setNodes, setEdges]);
  const reportThreat = useCallback(() => {
    const node = getNode(id);

    const threatNodeId = `${id}-threat${Math.random()}`;
    const threatEdgeId = `${id}-${id}-threat`;

    setNodes((prevNodes) => {
      const toggledNodes = prevNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              isThreat: true,
            },
          };
        }
        return node;
      });

      const newThreatNode = {
        id: threatNodeId,
        type: "threat",
        data: { label: "Threat Node", content: "Threat content" },
        position: {
          x: node.position.x + 250,
          y: node.position.y - 250,
        },
      };

      return [...toggledNodes, newThreatNode];
    });

    setEdges((prevEdges) => {
      const newEdge = {
        id: threatEdgeId,
        target: id,
        source: threatNodeId,
        type: "smoothstep",
        style: {
          strokeWidth: 2,
          stroke: "#FF0000", // red for threat
        },
        animated: true,
        label: "is threat to",
      };

      return [...prevEdges, newEdge];
    });
  }, [id, getNode, setNodes, setEdges]);
  const reportVulnerability = useCallback(() => {
    const node = getNode(id);

    const vulnerabilityNodeId = `${id}-vulnerability${Math.random()}`;
    const vulnerabilityEdgeId = `${id}-${id}-vulnerability`;

    setNodes((prevNodes) => {
      const toggledNodes = prevNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              isVulnerable: true,
            },
          };
        }
        return node;
      });

      const newVulnerabilityNode = {
        id: vulnerabilityNodeId,
        type: "vulnerability",
        data: { label: "Vulnerability Node", content: "Vulnerability content" },
        position: {
          x: node.position.x - 250,
          y: node.position.y - 250,
        },
      };

      return [...toggledNodes, newVulnerabilityNode];
    });

    setEdges((prevEdges) => {
      const newEdge = {
        id: vulnerabilityEdgeId,
        target: id,
        source: vulnerabilityNodeId,
        type: "smoothstep",
        style: {
          strokeWidth: 2,
          stroke: "#0000FF", // blue for vulnerability
        },
        animated: true,
        label: "is vulnerable to",
      };

      return [...prevEdges, newEdge];
    });
  }, [id, getNode, setNodes, setEdges]);

  // const reportVulnerability = useCallback(() => {
  //   const node = getNode(id);
  //   setNodes((nodes) => {
  //     const newNodes = nodes.map((node) => {
  //       if (node.id === id) {
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             isVulnerable: node.data.isVulnerable ? false : true,
  //           },
  //         };
  //       }
  //       return node;
  //     });
  //     return newNodes;
  //   });
  // }, [id, getNode, setNodes]);

  // const reportThreat = useCallback(() => {
  //   const node = getNode(id);
  //   setNodes((nodes) => {
  //     const newNodes = nodes.map((node) => {
  //       if (node.id === id) {
  //         return {
  //           ...node,
  //           data: {
  //             ...node.data,
  //             isThreat: node.data.isThreat ? false : true,
  //           },
  //         };
  //       }
  //       return node;
  //     });
  //     return newNodes;
  //   });
  // }, [id, getNode, setNodes]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className="bg-white border border-solid shadow-lg absolute z-50"
      {...props}
    >
      <p className="m-2 text-sm">
        <small>node: {id}</small>
      </p>
      <Button
        leftIcon={<HiDuplicate />}
        onClick={duplicateNode}
        className="border-none block p-2 text-left w-full "
      >
        duplicate
      </Button>
      <Button
        leftIcon={<TiDelete />}
        onClick={deleteNode}
        className="border-none block p-2 text-left w-full "
      >
        delete
      </Button>
      <Button
        leftIcon={<BsExclamationCircleFill />}
        onClick={reportRisk}
        className="border-none block p-2 text-left w-full "
      >
        report a Risk
      </Button>

      <Button
        leftIcon={<FaShieldVirus />}
        onClick={reportVulnerability}
        className="border-none block p-2 text-left w-full "
      >
        report a Vulnerability
      </Button>

      <Button
        leftIcon={<BsBugFill />}
        onClick={reportThreat}
        className="border-none block p-2 text-left w-full "
      >
        report a Threat
      </Button>
    </div>
  );
}
