import { BsThreeDots } from "react-icons/bs";
import DataTable from "./DataTable";
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
      {/* <table className="w-full text-sm text-left"> */}
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          Proposals
          <p className="mt-1 text-sm font-normal text-gray-500">
            Select Collaboration Projects.
          </p>
        </caption>
        <DataTable />
    </div>
  );
};

export default ProposalList;
