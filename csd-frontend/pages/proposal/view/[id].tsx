// @ts-nocheck
import Header from "@/components/Header";
import CButton from "@/components/Button";
import DatePicker from "react-datepicker";

import { MdSettings } from "react-icons/md";
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
  List,
  ListIcon,
  ListItem,
  Switch,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import CustomModal from "@/components/CustomModal";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import client from "@/components/apollo-client";
const ADD_proposal_QUERY = gql`
  mutation Addmutation($proposal: AddproposalInput!) {
    addproposal(proposal: $proposal) {
      name
    }
  }
`;
async function getproposal(id: string) {
  const { data } = await client.query({
    query: gql`
      query proposals {
        proposal(id: ${id}) {
          collaboration {
            name
          }
          id
          name
          status
          description
          date
        }
      }
    `,
  });
  return data.proposal;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const x = context.params;
  if (!x) {
    return {
      notFound: true,
    };
  } else {
    if (x.id) {
      const data = await getproposal(x.id as string);
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
      description: "Unable to find the proposal",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return <div>Unable to find the proposal</div>;
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
      <div className="flex ">
        <div className="m-2 px-6 flex-1">
          <div className=" bg-white ">
            <div className="flex flex-col justify-between gap-4">
              <div className="flex gap-2 items-center">
                <div className="w-full">
                  <FormLabel htmlFor="author">Author</FormLabel>
                  <Input
                    id="author"
                    placeholder="Author"
                    value={data.author}
                    disabled
                  />
                </div>
                <div className="w-full">
                  <FormLabel htmlFor="collaborationProject">
                    Collaboration Project
                  </FormLabel>
                  <Select
                    id="collaborationProject"
                    placeholder="Choose a Collaboration Project"
                    color={"gray.500"}
                    disabled
                  >
                    <option value="option1" selected>
                      {data.collaboration?.name ?? "Collaboration Project"}
                    </option>
                  </Select>{" "}
                </div>
              </div>

              <FormLabel htmlFor="name">Proposal Title</FormLabel>
              <Input id="name" placeholder="name" value={data.name} disabled />

              <FormLabel htmlFor="description">Proposal Description</FormLabel>
              <Textarea
                id="description"
                placeholder="description"
                value={data.description}
                disabled
              />
            </div>
          </div>
        </div>

        <div className="m-2 px-6 flex-1">
          <div className=" flex flex-col gap-4">
            <FormLabel htmlFor="Models">Change Logs</FormLabel>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={MdSettings} color="green.500" />
                Renamed Item 1
              </ListItem>
            </List>
            <FormLabel htmlFor="Models">Models</FormLabel>
            <div className=" grid grid-cols-3 gap-4 justify-items-stretch "></div>
            <CustomModal />
          </div>
        </div>
      </div>
    </div>
  );
}
