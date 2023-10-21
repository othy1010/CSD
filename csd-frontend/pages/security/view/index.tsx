import Header from "@/components/Header";
import Button from "@/components/Button";
import CollaborationList from "@/components/CollaborationList";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { gql } from "@apollo/client";
import client from "@/components/apollo-client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  CardFooter,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
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
  const head = await getHeader("Collaboration");
  const data = await getData("collaborations", head);
  // console.log("👍user server ENTER", context, head, data);

  return { props: { head, data } };
}

function Home({
  head,
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Header><></></Header>
      <div
        className="p-2 m-2 border
        rounded-lg "
      >
        <div className=" my-5 mb-20 flex justify-between items-center">
          <h1
            className="
              text-3xl 
              font-semibold
            "
          >
            Security Concepts
          </h1>

          <Link href="/security/import" className="">
            <Button className=" w-60">Import a File</Button>
          </Link>
        </div>
        {/* <div className="  my-5 flex justify-between items-center">
          <h1
            className="
              text-3xl 
              font-semibold mb-36
            "
          >
            
          </h1>

          <Link href="/collaboration/create" className="">
            <Button>Create Collaboration</Button>
          </Link>
        </div> */}

        <SimpleGrid
          columns={2}
          spacing={10}
          templateColumns="repeat(auto-fill, minmax(300px, 2fr))"
        >
          <Card>
            <CardHeader>
              <Heading size="md"> Vulnerabilities</Heading>
            </CardHeader>
            <CardFooter>
              <Button>
                <Link href={"/vulnerability/view"}>View here</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Threats</Heading>
            </CardHeader>
            <CardFooter>
              <Button>
                <Link href={"/threat/view"}>View here</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Weaknesses</Heading>
            </CardHeader>
            <CardFooter>
              <Button>
                <Link href={"/threat/view"}>View here</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Risks</Heading>
            </CardHeader>
            <CardFooter>
              <Button>
                <Link href={"/risk/view"}>View here</Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <Heading size="md"> Mitigations</Heading>
            </CardHeader>
            <CardFooter>
              <Button>
                <Link href={"/mitigation/view"}>View here</Link>
              </Button>
            </CardFooter>
          </Card>
        </SimpleGrid>
        {/* <DataTable data={data} head={head} /> */}
      </div>
    </div>
  );
}
export default Home;
