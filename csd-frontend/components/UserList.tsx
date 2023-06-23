import { BsThreeDots } from "react-icons/bs";

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
      <table className="w-full text-sm text-left">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          Users
          <p className="mt-1 text-sm font-normal text-gray-500">
            Select Collaboration Members.
          </p>
        </caption>
        <thead className="text-sm text-gray-700 uppercase bg-gray-50 font-bold">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Role
            </th>
            <th scope="col" className="px-6 py-3">
              Expertise Domain
            </th>
            <th scope="col" className="px-6 py-3">
              Eligible DM
            </th>
            <th scope="col" className="px-6 py-3">
              Is Moderator
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              <span className="sr-only">More</span>
            </th>
          </tr>
        </thead>
        <tbody className="text-xs text-gray-700 uppercase bg-gray-50">
          {users.map((user, index) => (
            <tr key={index} className="bg-white border-b">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {user.name}
              </th>
              <td className="px-6 py-4">{user.status}</td>
              <td className="px-6 py-4">{user.userRole}</td>
              <td className="px-6 py-4">{user.expertiseDomain}</td>
              <td className="px-6 py-4">{user.eligibleDM}</td>
              <td className="px-6 py-4">{user.isModerator ? "Yes" : "No"}</td>
              <td className="px-6 py-4">{user.email}</td>
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

export default UserList;
