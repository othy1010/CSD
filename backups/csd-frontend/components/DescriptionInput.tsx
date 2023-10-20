const DescriptionInput: React.FC = () => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      Description
    </label>
    <textarea
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      placeholder="Enter Description"
    />
  </div>
);
export default DescriptionInput;
