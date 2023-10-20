import React, { ReactNode, useEffect, useState } from "react";
import { Handle, Position } from "reactflow";
import { FcFolder } from "react-icons/fc";
import { BsExclamationCircleFill } from "react-icons/bs";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { FaShieldVirus } from "react-icons/fa";
import dayjs from "dayjs";
import error from "next/error";
import { useForm } from "react-hook-form";
import client from "@/components/apollo-client";
import { gql } from "@apollo/client";
import { GetServerSidePropsContext } from "next";
import { getRisks, getVulnerabilities } from "@/components/ApiQueries";
import { get } from "http";
type RiskType = {
  id: string;
  name: string;
  description: string;
  reference: string;
  refid: string;
  impactseverity: string;
};
type RisksType = {
  risks: RiskType[];
};

export default function RiskNode({ data }: any) {
  console.log("🚀 ~ file: RiskNode.tsx:46 ~ RiskNode ~ data:", data);
  const [risk, setRisk] = useState<RisksType | null>(null);

  useEffect(() => {
    async function fetchData() {
      const fetchedRisk = await getRisks();
      console.log(
        "🚀 ~ file: RiskNode.tsx:49 ~ fetchData ~ fetchedRisk:",
        fetchedRisk
      );
      setRisk(fetchedRisk);
    }
    fetchData();
  }, []);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  async function onSubmit(values: any) {
    // TODO : add validation
    values.status = values.status ? "ACTIVE" : "INACTIVE";
    const x = dayjs().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    console.log("📅⬆️❤️", dayjs(x), x);
  }
  return (
    <div className="shadow-md rounded-md bg-red-100 border-2 border-red-400 w-max">
      <div className="flex">
        <div className="">
          <div className="flex justify-center items-center gap-2 my-2">
            <BsExclamationCircleFill />
            <FormLabel htmlFor="vulnerability" className="text-lg font-bold">
              {data.label}
            </FormLabel>
          </div>
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-between gap-4"
            >
              <FormControl isInvalid={errors.vulnerability ? true : false}>
                <Select
                  id="vulnerability"
                  placeholder="Choose a Risk"
                  color={"gray.500"}
                  {...register("vulnerability", {
                    required: "This is required",
                  })}
                >
                  {risk?.risks?.map((vulnerability: any) => (
                    <option key={vulnerability.id} value={vulnerability.id}>
                      {vulnerability.name}
                    </option>
                  ))}
                </Select>

                <FormErrorMessage>
                  {
                    (errors.collaborationDescription &&
                      errors.collaborationDescription.message) as ReactNode
                  }
                </FormErrorMessage>
              </FormControl>
            </form>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 !bg-red-500"
      />
    </div>
  );
}
