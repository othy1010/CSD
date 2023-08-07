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
import axios from "axios";
import dynamic from "next/dynamic";

export const revalidate = 0;

export default async function Home() {
  
  

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
          Welcome back
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
    
    <div className="m-2 px-6 ">
      <SwaggerComponent />
    </div>
  </div>
    // {/* <SwaggerUI url={'/api-docs/springdocDefault'}
    //    deepLinking={true}
    //       docExpansion={'none'}
    //       defaultModelsExpandDepth={-1}
    //       requestInterceptor={(req) => {
    //         req.headers['Authorization'] = getBearerToken();
    //         if (req.method === 'GET' && req.body === '{"additionalProp1":"string","additionalProp2":"string","additionalProp3":"string"}') {
    //           req.body = undefined;
    //         }
    //         return req;
    //       }}
    //     /> */}      
  );
}
