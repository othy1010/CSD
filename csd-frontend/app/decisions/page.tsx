import Header from "@/components/Header";
import DataTable from "@/components/DataTable";


export const revalidate = 0;

export default async function Home() {
  
  return (
    <div
      className="
        bg-neutral-100 
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
              text-3xl 
              font-semibold
            "
          >
            Decisions
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
      <DataTable />
    </div>
  );
}
