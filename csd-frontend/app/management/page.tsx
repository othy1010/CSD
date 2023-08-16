"use client";
import Header from "@/components/Header";
import Button from "@/components/Button";
import CollaborationList from "@/components/CollaborationList";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";


export default async function Home() {
  const router = useRouter();
 
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
      <div className="mt-2 mb-7 px-3 flex justify-end gap-3">
        <div className="ml-2">
          <Button
            onClick={() => router.push("/collaboration/create")}
            className="bg-white px-4 py-1"
          >
            Create a Collaboration
          </Button>
        </div>
        <div>
          <Button  onClick={() => router.push("/collaboration/view")}className="bg-white px-4 py-1">Export</Button>
        </div>
      </div>
      <div className="m-2 px-6 ">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white ">
      <DataTable subject={"users"} head={"User"}/>

      </div>
      </div>
    </div>
  );
}
