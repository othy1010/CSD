"use client";
import Header from "@/components/Header";
import Button from "@/components/Button";

import { useRouter } from "next/navigation";
import UserList from "@/components/UserList";
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import {
  DateRangeType,
  DateValueType,
} from "react-tailwindcss-datepicker/dist/types";
import DateRangePicker from "@/components/DateRangePicker";
import SwaggerComponent from "@/components/Swagger";
import SwaggerUI from "swagger-ui-react";

interface DateRange {
  startDate: Date;
  endDate: Date;
}
export const revalidate = 0;

export default async function Home() {
  const router = useRouter();
  interface User {
    name: string;
    status: string;
    userRole: string;
    expertiseDomain: string;
    eligibleDM: string;
    isModerator: boolean;
    email: string;
  }

  const [value, setValue] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
  });
  type DateValueType = DateRangeType | null;

  const handleValueChange = (
    newValue: DateValueType,
    e?: HTMLInputElement | null
  ) => {
    console.log("newValue:", newValue);
    if (
      newValue !== null &&
      newValue.startDate !== null &&
      newValue.endDate !== null
    ) {
      setValue({
        startDate: new Date(newValue.startDate),
        endDate: new Date(newValue.endDate),
      });
    }
  };
  const users: User[] = [
    {
      name: "User 1",
      status: "Active",
      userRole: "Admin",
      expertiseDomain: "Software Engineering",
      eligibleDM: "Yes",
      isModerator: true,
      email: "user1@example.com",
    },
    {
      name: "User 2",
      status: "Inactive",
      userRole: "User",
      expertiseDomain: "Data Science",
      eligibleDM: "No",
      isModerator: false,
      email: "user2@example.com",
    },
    // Add more users as needed
  ];

  return (
    <div
      className="
        bg-neutral-900 
        rounded-lg 
        h-full 
        w-full 
        overflow-hidden 
        overflow-y-auto
        
      "
    >
      <Header>
        <div className="mb-2">
          <h1
            className="
            text-white 
              text-3xl 
              font-semibold
            "
          >
            Docs
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

      <SwaggerUI url="https://8080-othy1010-csd-kb3s9ye71lr.ws-eu101.gitpod.io/v3/api-docs" />
      
    </div>
  );
}
