import { BsThreeDots } from "react-icons/bs";
interface Proposal {
    title: string;
    status: string;
    description: string;
    collaborationProject: string;
    vulnerabilities: string;
    date: String;
  }

interface ProposalListProps {
  proposals: Proposal[];
}

const ProposalList: React.FC<ProposalListProps> = ({ proposals }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          Proposals
          <p className="mt-1 text-sm font-normal text-gray-500">
            Select Collaboration Projects.
          </p>
        </caption>
        <thead className="text-sm text-gray-700 uppercase bg-gray-50 font-bold">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Collaboration Project
            </th>
            <th scope="col" className="px-6 py-3">
              Vulnerabilities
            </th>
            <th scope="col" className="px-6 py-3">
              Date
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">More</span>
            </th>
          </tr>
        </thead>
        <tbody className="text-xs text-gray-700 uppercase bg-gray-50">
          {proposals.map((proposal, index) => (
            <tr key={index} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {proposal.title}
              </th>
              <td className="px-6 py-4">{proposal.status}</td>
              <td className="px-6 py-4">{proposal.description}</td>
              <td className="px-6 py-4">{proposal.collaborationProject}</td>
              <td className="px-6 py-4">{proposal.vulnerabilities}</td>
              <td className="px-6 py-4">{proposal.date}</td>
              <td className="px-6 py-4 text-right flex justify-end">
                <BsThreeDots />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProposalList;
