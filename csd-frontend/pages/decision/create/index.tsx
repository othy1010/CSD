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
const ADD_COLLABORATION_QUERY = gql`
  mutation Addmutation($collab: AddCollaborationInput!) {
    addCollaboration(collaboration: $collab) {
      name
    }
  }
`;

export default function Create() {
  const toast = useToast();
  const [addCollaboration, { data, loading, error }] = useMutation(
    ADD_COLLABORATION_QUERY
  );

  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(values: any) {
    // TODO : add validation
    // return new Promise<void>((resolve) => {
    values.status = values.status ? "ACTIVE" : "INACTIVE";
    await addCollaboration({
      variables: {
        collab: {
          name: values.name,
          description: values.description,
          startDate: values.startDate ? values.startDate : null,
          decisionDuration: values.decisionDuration
            ? values.decisionDuration
            : null,
          status: values.status ? values.status : null,
        },
      },
    });
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
        title: "Collaboration Added.",
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
            Create a Collaboration
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
            <FormControl isInvalid={errors.collaborationName? true : false}>
              <FormLabel htmlFor="name">Collaboration name</FormLabel>
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
                {(errors.collaborationName && errors.collaborationName.message) as ReactNode}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.collaborationDescription? true : false}>
              <FormLabel htmlFor="description">
                Collaboration Description
              </FormLabel>
              <Textarea
                id="description"
                placeholder="description"
                {...register("description", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
              <FormErrorMessage>
                {(errors.collaborationDescription &&
                  errors.collaborationDescription.message) as ReactNode}
              </FormErrorMessage>
            </FormControl>
            <div className="flex gap-2 items-center">
              <FormControl isInvalid={errors.collaborationDescription? true : false}>
                <FormLabel htmlFor="startDate">Start Date</FormLabel>
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePicker
                      className="border-2 border-gray-300 p-2 rounded-md"
                      placeholderText="Select date"
                      onChange={(date: any) => field.onChange(date)}
                      selected={field.value}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
              </FormControl>
              <FormControl isInvalid={errors.collaborationDescription? true : false}>
                <FormLabel htmlFor="decisionDuration">End Date</FormLabel>
                <Controller
                  control={control}
                  name="decisionDuration"
                  render={({ field }) => (
                    <DatePicker
                      className="border-2 border-gray-300 p-2 rounded-md"
                      placeholderText="Select date"
                      onChange={(date: any) => field.onChange(date)}
                      selected={field.value}
                      dateFormat="dd/MM/yyyy"
                    />
                  )}
                />
              </FormControl>
            </div>
            <FormControl isInvalid={errors.collaborationDescription? true : false}>
              <FormLabel htmlFor="decisionPattern">Decision Pattern</FormLabel>
              <Select
                id="decisionPattern"
                placeholder="Choose a Decision Pattern"
                color={"gray.500"}
                // {...register("decisionPattern", {
                //   required: "This is required",
                //   minLength: {
                //     value: 4,
                //     message: "Minimum length should be 4",
                //   },
                // })}
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>

              <FormErrorMessage>
                {(errors.collaborationDescription &&
                  errors.collaborationDescription.message) as ReactNode}
              </FormErrorMessage>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="status" mb="0">
                Activate
              </FormLabel>
              <Switch
                id="status"
                {...register("status", {
                  required: "This is required",
                  minLength: {
                    value: 4,
                    message: "Minimum length should be 4",
                  },
                })}
              />
            </FormControl>
            <Button mt={4} isLoading={isSubmitting} type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
