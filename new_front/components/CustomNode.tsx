import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { FaCheckCircle } from "react-icons/fa";

export default function CustomNode({ data }: any) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          <FaCheckCircle />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.name}</div>
          {data.fields.map((field: any) => {
            return (
              <div key={field.id}>
                <span className="font-bold">{field.name}</span>:{" "}
                <span className="font-mono">{field.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
      />
    </div>
  );
}
