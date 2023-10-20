import React, { useCallback } from "react";
import {
  useStore,
  getBezierPath,
  BaseEdge,
  Position,
  XYPosition,
  EdgeProps,
} from "reactflow";

type CustomFloatingEdgeProps = Partial<Pick<EdgeProps, "source" | "target">> &
  Omit<EdgeProps, "source" | "target"> & {
    sourceX?: number;
    sourceY?: number;
    targetX?: number;
    targetY?: number;
    sourcePosition?: Position;
    targetPosition?: Position;
    markerEnd?: string;
    style?: React.CSSProperties;
  };

interface EdgeParams {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
}

// Your getEdgeParams function should return an object of type EdgeParams
// This is just a placeholder implementation
const getEdgeParams = (sourceNode: any, targetNode: any): EdgeParams => {
  // Your implementation here
  return {
    sx: 0,
    sy: 0,
    tx: 0,
    ty: 0,
    sourcePos: Position.Top,
    targetPos: Position.Bottom,
  };
};

const CustomFloatingEdge: React.FC<CustomFloatingEdgeProps> = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
}) => {
  const sourceNode = useStore(
    useCallback((store) => store.nodes.find((n) => n.id === source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodes.find((n) => n.id === target), [target])
  );

  const {
    sx = sourceX || 0,
    sy = sourceY || 0,
    tx = targetX || 0,
    ty = targetY || 0,
    sourcePos = sourcePosition || Position.Top,
    targetPos = targetPosition || Position.Bottom,
  } = sourceNode && targetNode ? getEdgeParams(sourceNode, targetNode) : {};

  const edgePathData = {
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  };

  const [edgePath] = getBezierPath(edgePathData);

  return (
    <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
  );
};

export default CustomFloatingEdge;
