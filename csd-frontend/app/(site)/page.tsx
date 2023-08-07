"use client";
import Header from "@/components/Header";
import Button from "@/components/Button";
import CollaborationList from "@/components/CollaborationList";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";

export const revalidate = 0;

export default async function Home() {
  const router = useRouter();
  interface Item {
    title: string;
    description: string;
    manager: string;
    date: string;
    other: string;
  }

  const items: Item[] = [
    {
      title: "Item 1",
      description: "Description 1",
      manager: "Manager 1",
      date: "2023-06-23",
      other: "Other 1",
    },
    {
      title: "Item 2",
      description: "Description 2",
      manager: "Manager 2",
      date: "2023-06-24",
      other: "Other 2",
    },
    // Add more items as needed
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
      <DataTable subject={"collaborations"} head={"Collaboration"}/>

      </div>
      </div>
    </div>
  );
}
