import DropZone from "@/components/DropZone";
import Header from "@/components/Header";

import React from "react";

export default function Create() {
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
            Import a File
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
          <DropZone />
        </div>
      </div>
    </div>
  );
}
