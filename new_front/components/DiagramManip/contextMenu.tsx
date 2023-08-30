import { report } from "process";
import React, { useCallback, useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import { getCollaboration, getVulnerabilities } from "../ApiQueries";
import { GetServerSidePropsContext } from "next";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { BsBugFill } from "react-icons/bs";
import { TiDelete } from "react-icons/ti";
import { HiDuplicate } from "react-icons/hi";
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

  const reportProblem = useCallback(() => {
    const node = getNode(id);
    setNodes((nodes) => {
      const newNodes = nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              isProblematic: node.data.isProblematic ? false : true,
            },
          };
        }
        return node;
      });
      return newNodes;
    });
  }, [id, getNode, setNodes]);

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
        leftIcon={<BsBugFill />}
        onClick={reportProblem}
        className="border-none block p-2 text-left w-full "
      >
        report a Problem
      </Button>
      {/* <Menu>
        <MenuButton
          as={Button}
          leftIcon={<BsBugFill />}
          className="border-none block p-2 text-left w-full "
        >
          report a Problem
        </MenuButton>
        <MenuList>
          <MenuItem>Download</MenuItem>
          <MenuItem>Create a Copy</MenuItem>
          <MenuItem>Mark as Draft</MenuItem>
          <MenuItem>Delete</MenuItem>
          <MenuItem>Attend a Workshop</MenuItem>
        </MenuList>
      </Menu> */}
      {/* <button
        onClick={reportProblem}
        className="border-none block p-2 text-left w-full hover:bg-white"
      >
        report a Problem
      </button> */}
    </div>
  );
}
