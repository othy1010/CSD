// @ts-nocheck
import Header from "@/components/Header";
import CButton from "@/components/Button";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import React, { ReactNode, useEffect, useState } from "react";
import Datepick from "@/components/Datepick";
import { Controller, useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Textarea,
  Select,
  Switch,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import client from "@/components/apollo-client";
const ADD_COLLABORATION_QUERY = gql`
  mutation Addmutation($collab: AddCollaborationInput!) {
    addCollaboration(collaboration: $collab) {
      name
    }
  }
`;
async function getCollaboration(id: string) {
  const { data } = await client.query({
    query: gql`
      query Collaborations {
        collaboration(id: ${id}) {
          id
          name
          description
          startDate
          decisionDuration
          evaluationDuration
          status
        }
      }
    `,
  });
  return data.collaboration;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const x = context.params;
  if (!x) {
    return {
      notFound: true,
    };
  } else {
    if (x.id) {
      const data = await getCollaboration(x.id as string);
      return { props: { data } };
    }
  }
}

export default function View({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const toast = useToast();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  console.log("from the client", data);
  if (!data) {
    toast({
      title: "Not found.",
      description: "Unable to find the collaboration",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return <div>Unable to find the collaboration</div>;
  }

  

  return (
    <div>
      <Header>
        <div className="mb-2 mt-10">
          <h1
            className="
              text-3xl 
              font-semibold
            "
          >
            {data.name}
          </h1>
          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              xl:grid-cols-3 
              2xl:grid-cols-4 
              gap-3 
              mt-4
            "
          ></div>
        </div>
      </Header>

      <div className="m-2 px-6">
        <div className=" bg-white w-3/6">
          <div className="flex flex-col justify-between gap-4">
            <FormLabel htmlFor="name">Collaboration name</FormLabel>
            <Input id="name" placeholder="name" value={data.name} disabled />

            <FormLabel htmlFor="description">
              Collaboration Description
            </FormLabel>
            <Textarea
              id="description"
              placeholder="description"
              value={data.description}
              disabled
            />

            <div className="flex gap-2 items-center">
              <FormLabel htmlFor="startDate">Start Date</FormLabel>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  console.log("😍", field),
                  (
                    <DatePicker
                      className="border-2 border-gray-300 p-2 rounded-md"
                      placeholderText="Select date"
                      onChange={(date: any) => field.onChange(date)}
                      selected={Date.parse(data.startDate)}
                      disabled
                      dateFormat="dd/MM/yyyy"
                    />
                  )
                )}
              />

              <FormLabel htmlFor="decisionDuration">End Date</FormLabel>
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  console.log("😍", field),
                  (
                    <DatePicker
                      className="border-2 border-gray-300 p-2 rounded-md"
                      placeholderText="Select date"
                      onChange={(date: any) => field.onChange(date)}
                      selected={Date.parse(data.decisionDuration)}
                      disabled
                      dateFormat="dd/MM/yyyy"
                    />
                  )
                )}
              />
            </div>
            <FormLabel htmlFor="decisionPattern">Decision Pattern</FormLabel>
            <Select
              id="decisionPattern"
              placeholder="Choose a Decision Pattern"
              color={"gray.500"}
              disabled
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>

            <FormLabel htmlFor="status" mb="0">
              Active
            </FormLabel>
            <Switch id="status" value={data.status} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}
