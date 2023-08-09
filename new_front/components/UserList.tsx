import { BsThreeDots } from "react-icons/bs";
import DataTable from "./DataTable";


interface User {
  name: string;
  status: string;
  userRole: string;
  expertiseDomain: string;
  eligibleDM: string;
  isModerator: boolean;
  email: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      {/* <table className="w-full text-sm text-left"> */}
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          Users
          <p className="mt-1 text-sm font-normal text-gray-500">
            Select Collaboration Members.
          </p>
        </caption>
    </div>
  );
};

export default UserList;
