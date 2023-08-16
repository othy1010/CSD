"use client";
import Header from "@/components/Header";
import Button from "@/components/Button";

import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { FormGroup } from "@mui/material";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import Datepick from "@/components/Datepick";
interface DateRange {
  startDate: Date;
  endDate: Date;
}

// async function getData(id: string) {

//   const { loading, error, data } = await client.query({
//     query: gql`query {
//     collaboration(id: "${id}") {
//       id
//       name
//       description
//       startDate
//       decisionDuration
//       evaluationDuration
//       status
//   }
// }`
//     ,
//   });
//   return { loading, error, data }
// }
export default async function Create() {
  // const { loading, error, data } = await getData(params.id);
  // console.log("⬆️ PAGE PARAMS", params.id);

  // console.log("♾️ PAGE DATA", data);
  // if (loading) return <div>Loading...</div>;
  // const [value, setValue] = useState<String | null>();

  const [checked, setChecked] = useState<string>("");

  useEffect(() => {
    console.log("say something once");
    return () => {
      console.log("why say it again?");
    };
  }, [checked]);

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
      {/* <Header>
        <div className="mb-2">
          <h1
            className="
            text-white 
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
      </Header> */}

      <div className="m-2 px-6">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white w-3/6">
          <FormGroup className="flex flex-col gap-4">
            <TextField
              className="m-2 bg-white"
              required
              id="outlined-required"
              label="Name"
            />
            <TextField
              className="m-2 bg-white"
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
            />
            <div className="m-2 bg-white flex items-center">
              {/* <Datepick  setValue2={setValue2} /> */}
              <input
                type="text"
                value={checked}
                onChange={(c) => setChecked(c.target.value)}
              />
              <div className="m-2 bg-white">
                <DatePicker label="End Date" />
              </div>
            </div>
            <TimeField
              className="m-2 bg-white"
              label="Decision Duration"
              format="HH:mm"
            />
          </FormGroup>
        </div>
        <div className="mt-2 mb-7 px-3 flex justify-end gap-3">
          <div className="ml-2">
            <Button className="bg-white px-4 py-1">
              Create a Collaboration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
