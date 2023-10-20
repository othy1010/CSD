import React from "react";
import { Handle, Position } from "reactflow";
import { FcFolder } from "react-icons/fc";
import {
  BsBugFill,
  BsExclamationCircleFill,
  BsShieldFillExclamation,
} from "react-icons/bs";
import { Tooltip } from "@chakra-ui/react";
import { FaShieldVirus } from "react-icons/fa";

export default function CustomNode({ data }: any) {
  return (
    <div className="shadow-md rounded-md bg-white border-2 border-stone-400 w-max">
      <div className="flex gap-2">
        {data.isRisk && (
          <div>
            <Tooltip
              hasArrow
              label="CVE-2014-0050"
              placement="top"
              bg="red.600"
            >
              <BsExclamationCircleFill className=" top-2 left-2 text-red-500 text-2xl" />
            </Tooltip>
          </div>
        )}
        {data.isVulnerable && (
          <div>
            <Tooltip
              hasArrow
              label="CVE-2014-0050"
              placement="top"
              bg="red.600"
            >
              <FaShieldVirus className=" top-2 left-2 text-red-500 text-2xl" />
            </Tooltip>
          </div>
        )}
        {data.isThreat && (
          <div>
            <Tooltip
              hasArrow
              label="CVE-2014-0050"
              placement="top"
              bg="red.600"
            >
              <BsBugFill className=" top-2 left-2 text-red-500 text-2xl" />
            </Tooltip>
          </div>
        )}
      </div>
      <div className="flex">
        <div className="">
          <div className="flex justify-center items-center gap-2 my-2">
            <FcFolder />
            <div className="text-lg font-bold">{data.name}</div>
          </div>
          {/* divider */}
          <div className="border-b-2 border-stone-400 my-2" />
          <div className="flex flex-col gap-2 mx-2">
            {data.fields.map((field: any) => {
              return (
                <div key={field.id} className="flex gap-2 center p-2">
                  <span className="font-bold">{field.name}</span>:{" "}
                  <div className="font-mono">{field.value}</div>
                </div>
              );
            })}
          </div>
          <div className="border-b-2 border-stone-400 my-2" />
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-6 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-6 !bg-teal-500"
      />
    </div>
  );
}
