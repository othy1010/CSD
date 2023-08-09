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

const ADD_USER_QUERY = gql`
  mutation Addmutation($user: AddUserInput!) {
    addUser(user: $user) {
      name
    }
  }
`;

export default function Create() {
  const toast = useToast();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [addUser, { data, loading, error }] = useMutation(ADD_USER_QUERY);

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values: any) {
    // TODO : add validation
    // return new Promise<void>((resolve) => {

    await addUser({
      variables: {
        user: {
          name: values.name,
          email: values.email,
          password: values.password,
          expertise: values.expertise,
          userRole: values.userRole,
          isModerator: values.isModerator,
          active: values.status,
        },
      },
    });
    console.log("USER ❤️", values);
    if (error) {
      toast({
        title: "An error occurred.",
        description: error.message,
        position: "top",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } else {
      toast({
        title: "User Added.",
        position: "top",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      //   setTimeout(() => {
      //     console.log(JSON.stringify(values, null, 2));
      //     resolve();
      //   }, 1);
      // });
    }
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
            Create a User
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-between gap-4"
          >
            <FormControl isInvalid={errors.name}>
              <FormLabel htmlFor="name">Username</FormLabel>
              <Input
                id="name"
                placeholder="name"
                {...register("name", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {(errors.name && errors.name.message) as ReactNode}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.email}>
              <FormLabel htmlFor="email">User email</FormLabel>
              <Input
                id="email"
                placeholder="email"
                {...register("email", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {(errors.email && errors.email.message) as ReactNode}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password", {
                    required: "This is required",
                    minLength: {
                      value: 4,
                      message: "Minimum length should be 4",
                    },
                  })}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {(errors.password && errors.password.message) as ReactNode}
              </FormErrorMessage>
            </FormControl>

            <div className="flex gap-2 items-center">
              <FormControl isInvalid={errors.expertise}>
                <FormLabel htmlFor="expertise">Expertise</FormLabel>
                <Select
                  id="expertise"
                  placeholder="Choose the user Expertise"
                  color={"gray.500"}
                  {...register("expertise", {
                    required: "This is required",
                  })}
                >
                  <option value="Expertise1">Expertise 1</option>
                  <option value="Expertise2">Expertise 2</option>
                  <option value="Expertise3">Expertise 3</option>
                </Select>

                <FormErrorMessage>
                  {(errors.expertise && errors.expertise.message) as ReactNode}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.userRole ? true : false}>
                <FormLabel htmlFor="userRole">User Role</FormLabel>
                <Select
                  id="userRole"
                  placeholder="Choose the user Role"
                  color={"gray.500"}
                  {...register("userRole", {
                    required: "This is required",
                  })}
                >
                  <option value="DEVELOPER">DEVELOPER</option>
                  <option value="ARCHITECT">ARCHITECT</option>
                  <option value="SECURITYEXPERT">SECURITYEXPERT</option>
                  <option value="MANAGER">MANAGER</option>
                </Select>

                <FormErrorMessage>
                  {(errors.userRole && errors.userRole.message) as ReactNode}
                </FormErrorMessage>
              </FormControl>
            </div>
            <div className="flex gap-2 items-center">
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="active" mb="0">
                  Activate
                </FormLabel>
                <Switch id="active" {...register("active")} />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="isModerator" mb="0">
                  isModerator
                </FormLabel>
                <Switch id="isModerator" {...register("isModerator")} />
              </FormControl>
            </div>
            <Button mt={4} isLoading={isSubmitting} type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
