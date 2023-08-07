import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

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
  type : string; 
}

async function getHeader(head : string) {
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
    kind : field.type.kind,
    type : field.type.ofType ? field.type.ofType.kind : field.type.kind
  }));
  const r = header.filter((item: Header) => item.kind !== 'LIST' && item.type !== 'OBJECT') 
  
  console.log(r)
  return r;
}

async function getData(subject: string,fields: [Header]) {
  const f =  fields.filter(field => field.kind !== 'LIST' && field.type !== 'OBJECT').map(item => `        ${item.field}`).join('\n');
  const quer = `
  query ${subject} {
   ${subject} {
     ${f}
 }
}
`
console.log("😒",quer)
  const { data } = await client.query({
    query: gql`${quer}`,
  });
  console.log("😒",quer,data)
  return data[subject]
}


export default async function DataTable({subject,head} : { subject: string; head: string; }) {
  const header = await getHeader(head)
  const data = await getData(subject,header)
  console.log("👍data ",data)
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={header}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}