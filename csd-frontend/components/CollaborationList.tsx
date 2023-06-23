import { BsThreeDots } from "react-icons/bs";

interface Item {
  title: string;
  description: string;
  manager: string;
  date: string;
  other: string;
}

interface ItemListProps {
  items: Item[];
}

const CollaborationList: React.FC<ItemListProps> = ({ items }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white">
          Collaborations
          <p className="mt-1 text-sm font-normal text-gray-500">
            Write a description.
          </p>
        </caption>
        <thead className="text-sm text-gray-700 uppercase bg-gray-50 font-bold">
          <tr>
            <th className="w-4 p-4">
              <div className="flex items-center">
                <input id="checkbox-table-search-1" type="checkbox" />
                <label className="sr-only">checkbox</label>
              </div>
            </th>
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
              Manager
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
          {items.map((item, index) => (
            <tr key={index} className="bg-white border-b">
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-${index}`}
                    type="checkbox"
                  />
                  <label className="sr-only">checkbox</label>
                </div>
              </td>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {item.title}
              </th>

              <td className="px-6 py-4">Status</td>
              <td className="px-6 py-4">{item.description}</td>
              <td className="px-6 py-4">{item.manager}</td>
              <td className="px-6 py-4">{item.date}</td>
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

export default CollaborationList;
