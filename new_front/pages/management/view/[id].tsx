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
  InputGroup,
  InputRightElement,
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
async function getUser(id: string) {
  console.log("from the server", id);

  const { data } = await client.query({
    query: gql`
      query User {
    user (id: ${id}) {
        id
        name
        email
        password
        expertise
        userRole
        isModerator
        active
    }
       
      }
    `,
  });
  return data.user;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const x = context.params;
  console.log("from the server", x);

  if (!x) {
    return {
      notFound: true,
    };
  } else {
    if (x.id) {
      const data = await getUser(x.id as string);
      console.log("from the server", data);
      return { props: { data } };
    }
  }
}

export default function View({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  console.log("from the client", data);
  if (!data) {
    toast({
      title: "Not found.",
      description: "Unable to find the collaboration",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return <div>Unable to find the User</div>;
  }

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

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
            User {data.name}
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
            <div>
              <FormLabel htmlFor="name">Username</FormLabel>
              <Input id="name" placeholder="name" value={data.name} disabled />
            </div>
            <div>
              <FormLabel htmlFor="email">User email</FormLabel>
              <Input
                id="email"
                placeholder="email"
                value={data.email}
                disabled
              />
            </div>
            <div>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  value={data.password}
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  disabled
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </div>

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <FormLabel htmlFor="expertise">Expertise</FormLabel>
                <Select
                  id="expertise"
                  value={data.expertise}
                  placeholder="Choose the user Expertise"
                  disabled
                  color={"gray.500"}
                >
                  <option value="Expertise1">Expertise 1</option>
                  <option value="Expertise2">Expertise 2</option>
                  <option value="Expertise3">Expertise 3</option>
                </Select>
              </div>
              <div className="flex-1">
                <FormLabel htmlFor="userRole">User Role</FormLabel>
                <Select
                  id="userRole"
                  value={data.userRole}
                  placeholder="Choose the user Role"
                  color={"gray.500"}
                  disabled
                >
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="ARCHITECT">ARCHITECT</option>
                  <option value="SECURITYEXPERT">SECURITYEXPERT</option>
                  <option value="MANAGER">MANAGER</option>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <FormLabel htmlFor="active" mb="0">
                  Active
                </FormLabel>
                <Switch id="active" disabled isChecked={data.active} />
              </div>
              <div className="flex-1">
                <FormLabel htmlFor="isModerator" mb="0">
                  isModerator
                </FormLabel>
                <Switch id="isModerator" disabled isChecked={data.active} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
