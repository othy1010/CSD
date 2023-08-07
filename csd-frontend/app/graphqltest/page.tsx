
import { gql } from "@apollo/client";
import client from "@/components/apollo-client";

type Collaboration = {
  id: string;
  name: string; 
  description: string;
  date: string;
  status: string;

};

async function getData() {
  const { data } = await client.query({
    query: gql`
      query Collaborations {
        collaborations {
          id
          name
          description
          date
          status
    }
}

    `,
  });
  console.log(data)
  return data.collaborations
}

export default async function Home() {
  const collabs = await getData()
  return (
    <div >


      <main >

        <div >
          <h1 >Collaborations</h1>
          <ul >
            {collabs.map((collab : Collaboration) => (
              <li key={collab.id}>
                <a >{collab.name}</a>
              </li>
            ))}
          </ul>

        </div>
      </main>


    </div>
  );
}

