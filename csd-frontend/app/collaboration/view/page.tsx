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
import ProposalList from "@/components/ProposalList";
import CollaborationModels from "@/components/CollaborationModels";
import LoremIpsum, { loremIpsum } from "react-lorem-ipsum";
import DataTable from "@/components/DataTable";
import { gql } from "@apollo/client";
import client from "@/components/apollo-client";

interface DateRange {
  startDate: Date;
  endDate: Date;
}
export const revalidate = 0;

interface User {
  name: string;
  status: string;
  userRole: string;
  expertiseDomain: string;
  eligibleDM: string;
  isModerator: boolean;
  email: string;
}
interface Proposal {
  title: string;
  status: string;
  description: string;
  collaborationProject: string;
  vulnerabilities: string;
  date: String;
}

export default function Home() {

  const router = useRouter();
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
  const proposalsl: Proposal[] = [
    {
      title: "Propo 1",
      status: "Active",
      description: "Proposal description",
      collaborationProject: "Collab 1",
      vulnerabilities: "Moderated",
      date: Date.toString(),
    }
  ];
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
            Collab 1
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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white ">
          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Title</div>
            <div
              className="shadow appearance-none  border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"

              placeholder="Enter Collaboration Title"
            >Title </div>
          </div>
          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Description</div>
            <textarea
              disabled={true}
              className="shadow appearance-none  border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"
              placeholder={loremIpsum().toString()}
              name="Text1" cols={40} rows={5}>

            </textarea>

          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* <table className="w-full text-sm text-left"> */}
            <div className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
              Users
              <p className="mt-1 text-sm font-normal text-gray-500">
                Select Collaboration Members.
              </p>
            </div>
            <DataTable subject={"users"} head={"User"} />
          </div>
          {/* <UserList users={users} />
          <ProposalList proposals={proposalsl} /> */}
          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Collaboration Date</div>

            <Datepicker
              inputClassName="shadow appearance-none  border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"
              showShortcuts={true}
              showFooter={true}
              value={value}
              disabled={true}
              onChange={handleValueChange}
            />
          </div>
          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Decision Pattern</div>
            <select
              id="countries"
              disabled={true}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 "
            >
              <option>Choose a Decision Pattern</option>
              <option value="dp1">Decision P 1 </option>
              <option value="dp2">Decision P 2 </option>
              <option value="dp3">Decision P 3 </option>
              <option value="dp4">Decision P 4 </option>
            </select>
          </div>

          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Models</div>
            <div className="flex gap-2">

              <CollaborationModels />
              <CollaborationModels />
            </div>
          </div>

        </div>
      </div>
      <div className="mt-2 mb-7 px-3 flex justify-end gap-3">
        <div className="ml-2">
          <Button
            onClick={() => router.push("/")}
            className="bg-white px-4 py-1"
          >
            Create a Collaboration
          </Button>
        </div>
        <div>
          <Button className="bg-white px-4 py-1">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
