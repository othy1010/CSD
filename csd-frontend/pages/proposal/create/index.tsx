import Header from "@/components/Header";
// import Image from "next/image";
import { MdSettings } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import React, { ReactNode } from "react";
import { useForm } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Image,
  Textarea,
  List,
  ListIcon,
  ListItem,
  Select,
} from "@chakra-ui/react";
import { gql, useMutation } from "@apollo/client";
import { useToast } from "@chakra-ui/react";
import CustomModal from "@/components/CustomModal";
import dayjs from "dayjs";
import { get } from "http";
import { getCollaboration, getVulnerabilities } from "@/components/ApiQueries";
import { GetServerSidePropsContext } from "next";
import { BsFillFileCodeFill } from "react-icons/bs";

const ADD_PROPOSAL_QUERY = gql`
  mutation Addmutation($proposal: AddProposalInput!) {
    addProposal(proposal: $proposal) {
      name
    }
  }
`;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const collaboration = await getCollaboration({ name: true });
  const vulnerabilities = await getVulnerabilities();

  // console.log("👍user server ENTER", context, collaboration, data);

  return { props: { collaboration, vulnerabilities } };
}

export default function Create({
  collaboration,
}: {
  collaboration: any;
  vulnerabilities: any;
}) {
  const toast = useToast();
  const [addProposal, { data, loading, error }] =
    useMutation(ADD_PROPOSAL_QUERY);

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
    await addProposal({
      variables: {
        proposal: {
          name: values.name,
          description: values.description,
          // format date
          date: x,
          status: "PENDING",
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
        title: "Proposal Added.",
        position: "top",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
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
            Create a Proposal
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-between gap-4"
            >
              <div className="flex gap-2 items-center">
                <FormControl
                  isInvalid={errors.collaborationName ? true : false}
                >
                  <FormLabel htmlFor="author">Author</FormLabel>
                  <Input
                    id="author"
                    placeholder="Author"
                    value={"Author"}
                    {...register("author", {
                      required: "This is required",
                      minLength: {
                        value: 4,
                        message: "Minimum length should be 4",
                      },
                    })}
                  />
                  <FormErrorMessage>
                    {
                      (errors.collaborationName &&
                        errors.collaborationName.message) as ReactNode
                    }
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.collaborationDescription ? true : false}
                >
                  <FormLabel htmlFor="decisionPattern">
                    Collaboration Project
                  </FormLabel>
                  <Select
                    id="collaborationProject"
                    placeholder="Choose a Collaboration Project"
                    color={"gray.500"}
                    {...register("collaborationProject", {
                      required: "This is required",
                    })}
                  >
                    {collaboration?.collaborations.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
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
              </div>
              <FormControl isInvalid={errors.collaborationName ? true : false}>
                <FormLabel htmlFor="name">Proposal Title</FormLabel>
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
                  {
                    (errors.collaborationName &&
                      errors.collaborationName.message) as ReactNode
                  }
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={errors.collaborationDescription ? true : false}
              >
                <FormLabel htmlFor="description">
                  Proposal Description
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
                  {
                    (errors.collaborationDescription &&
                      errors.collaborationDescription.message) as ReactNode
                  }
                </FormErrorMessage>
              </FormControl>

              <Button mt={4} isLoading={isSubmitting} type="submit">
                Submit
              </Button>
            </form>
          </div>
        </div>
        <div className="m-2 px-6 flex-1">
          <div className=" flex flex-col gap-4">
            <FormLabel htmlFor="Models">Models</FormLabel>
            <div className=" grid grid-cols-3 gap-4 justify-items-stretch ">
              <BsFillFileCodeFill className="text-9xl text-sky-900" />
            </div>
            <CustomModal />
          </div>
        </div>
      </div>
    </div>
  );
}
