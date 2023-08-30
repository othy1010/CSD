import { gql } from "@apollo/client";
import client from "./apollo-client";

const ADD_PROPOSAL_QUERY = gql`
  mutation Addmutation($proposal: AddProposalInput!) {
    addProposal(proposal: $proposal) {
      name
    }
  }
`;

const ADD_VULNERABILITY_QUERY = gql`
  mutation AddVulnerability($vulnerability: AddVulnerabilityInput!) {
    addVulnerability(vulnerability: $vulnerability) {
      id
      name
    }
  }
`;

const ADD_COLLABORATION_QUERY = gql`
  mutation Addmutation($collab: AddCollaborationInput!) {
    addCollaboration(collaboration: $collab) {
      name
    }
  }
`;

const ADD_USER_QUERY = gql`
  mutation Addmutation($user: AddUserInput!) {
    addUser(user: $user) {
      name
    }
  }
`;
interface CollaborationOptions {
  name?: boolean;
  description?: boolean;
  startDate?: boolean;
  decisionDuration?: boolean;
  evaluationDuration?: boolean;
  status?: boolean;
}
async function getCollaboration(
  options: CollaborationOptions = {}
): Promise<any> {
  const {
    name = false,
    description = false,
    startDate = false,
    decisionDuration = false,
    evaluationDuration = false,
    status = false,
  } = options;

  const fields = [];
  if (name) fields.push("name");
  if (description) fields.push("description");
  if (startDate) fields.push("startDate");
  if (decisionDuration) fields.push("decisionDuration");
  if (evaluationDuration) fields.push("evaluationDuration");
  if (status) fields.push("status");

  const { data } = await client.query({
    query: gql`
      query Collaborations {
        collaborations {
          ${fields.join("\n")}
        }
      }
    `,
  });
  return data;
}
async function getVulnerabilities(): Promise<any> {
  const { data } = await client.query({
    query: gql`
      query Vulnerabilities {
        vulnerabilities {
          id
          name
          description
          reference
          refid
          date
        }
      }
    `,
  });
  console.log("🚀 ~ file: ApiQueries.ts:91 ~ getVulnerabilities ~ data:", data);
  return data;
}
export {
  ADD_PROPOSAL_QUERY,
  ADD_VULNERABILITY_QUERY,
  ADD_COLLABORATION_QUERY,
  ADD_USER_QUERY,
  getCollaboration,
  getVulnerabilities,
};
