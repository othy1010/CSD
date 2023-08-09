import Header from "@/components/Header";
import Button from "@/components/Button";
import CollaborationList from "@/components/CollaborationList";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { gql } from "@apollo/client";
import client from "@/components/apollo-client";
interface Field {
  name: string;
  type: {
    kind: string;
    ofType: {
      kind: string;
    };
  };
}
interface Header {
  field: string;
  headerName: string;
  kind: string;
  type: string;
}

async function getHeader(head: string) {
  const { data } = await client.query({
    query: gql`
    {
      __type(name: "${head}") {
        fields {
          name
          type {
            kind
            ofType {
              kind
            }
          }
         
        }
    }
    }

`,
  });
  const header = data.__type.fields.map((field: Field) => ({
    field: field.name,
    headerName: field.name,
    minWidth: 150,
    kind: field.type.kind,
    type: field.type.ofType ? field.type.ofType.kind : field.type.kind,
  }));
  const r = header.filter(
    (item: Header) => item.kind !== "LIST" && item.type !== "OBJECT"
  );

  return r;
}

async function getData(subject: string, fields: [Header]) {
  const f = fields
    .filter((field) => field.kind !== "LIST" && field.type !== "OBJECT")
    .map((item) => `        ${item.field}`)
    .join("\n");
  const quer = `
  query ${subject} {
   ${subject} {
     ${f}
 }
}
`;
  const { data } = await client.query({
    query: gql`
      ${quer}
    `,
  });
  return data[subject];
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const head = await getHeader("Decision");
  const data = await getData("decisions", head);
  // console.log("👍user server ENTER", context, head, data);

  return { props: { head, data } };
}

function Home({
  head,
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log("👍 server EXIT", head, data);
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
            Your Decisions
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
      <DataTable data={data} head={head} />
    </div>
  );
}
export default Home;
