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
import dayjs from "dayjs";

async function getVulnerability(id: string) {
  const { data } = await client.query({
    query: gql`
      query Vulnerability {
        vulnerability(id: ${id}) {
          id
          name
          description
          reference
          refid
          date
        } 
      }
    `,
  });
  return data.vulnerability;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const x = context.params;
  if (!x) {
    return {
      notFound: true,
    };
  } else {
    if (x.id) {
      const data = await getVulnerability(x.id as string);
      return { props: { data } };
    }
  }
}

export default function View({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // console.log("🚀 ~ file: [id].tsx:52 ~ getServerSideProps ~ data:", data);
  const formatDate = (dateValue: string) => {
    let date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.log("Invalid Date", dayjs(dateValue));
      date = dayjs(dateValue).toDate();
    }
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const toast = useToast();
  
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  if (!data) {
    toast({
      title: "Not found.",
      description: "Unable to find the Vulnerability",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
    return <div>Unable to find the Vulnerability</div>;
  }


  return (
    <div>
      <Header><></></Header>
      <div
        className="p-2 m-2 border
        rounded-lg"
      >
        <div className=" my-5 flex justify-between items-center">
          <h1
            className="
              text-3xl 
              font-semibold
            "
          >
            {data.name}
          </h1>
        </div>
        <div className="m-2 px-6">
          <div className=" bg-white w-3/6">
            <div className="flex flex-col justify-between gap-4">
              <FormLabel htmlFor="name">Vulnerability name</FormLabel>
              <Input id="name" placeholder="name" value={data.name} disabled />

              <FormLabel htmlFor="description">
                Vulnerability Description
              </FormLabel>
              <Textarea
                id="description"
                placeholder="description"
                value={data.description}
                disabled
              />

              <FormLabel htmlFor="startDate">Issue Date</FormLabel>
              <Input
                id="name"
                placeholder="name"
                value={formatDate(data.date)}
                disabled
              />
              <FormLabel htmlFor="startDate">Reference</FormLabel>
              <Input
                id="name"
                placeholder="name"
                value={data.reference}
                disabled
              />
              <FormLabel htmlFor="startDate">Reference ID</FormLabel>
              <Input id="name" placeholder="name" value={data.refid} disabled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
