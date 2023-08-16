"use client";
import Header from "@/components/Header";
import Button from "@/components/Button";

import React from "react";
import CollaborationModels from "@/components/CollaborationModels";
import { gql } from "@apollo/client";
import client from "@/components/apollo-client";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
interface DateRange {
  startDate: Date;
  endDate: Date;
}

async function getData(id: string) {

  const { loading, error, data } = await client.query({
    query: gql`query {
    collaboration(id: "${id}") {
      id
      name
      description
      startDate
      decisionDuration
      evaluationDuration
      status
  }
}`
    ,
  });
  return { loading, error, data }
}
export default async function View({ params }: { params: { id: string } }) {

  const { loading, error, data } = await getData(params.id);
  console.log("⬆️ PAGE PARAMS", params.id);

  console.log("♾️ PAGE DATA", data);
  if (loading) return <div>Loading...</div>;
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
            {data.collaboration.name}
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
            <div className="text-lg font-semibold">Name</div>
            <div
              className="shadow appearance-none  border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"
              placeholder="Enter Collaboration Title"> 
              {data.collaboration.name}
            </div>
          </div>
          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Description</div>
            <textarea
              disabled={true}
              className="shadow appearance-none  border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900"
              name="Text1" cols={40} rows={5}
              value={data.collaboration.description}
              >
            </textarea>

          </div>

          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Start Date</div>
           
            <DatePicker value={data.collaboration.startDate}  />

          </div>
          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Decision Duration</div>
            <div className="shadow appearance-none  border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900">
              {data.collaboration.decisionDuration}
            </div>
          </div>

          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Evaluation Duration</div>
            <div className="shadow appearance-none  border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900">
              {data.collaboration.evaluationDuration}
            </div>
          </div>

          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Status</div>
            <div className="shadow appearance-none  border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-white text-gray-900">
              {data.collaboration.status}
            </div>
          </div>



          <div className="p-5 text-left text-gray-900 ">
            <div className="text-lg font-semibold">Models</div>
            <div className="flex gap-2">

              <CollaborationModels />
              <CollaborationModels />
              <CollaborationModels />
            </div>
          </div>

        </div>
      </div>
    
    </div>
  );
}
