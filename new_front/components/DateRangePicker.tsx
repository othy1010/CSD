import React, { useState, ChangeEvent } from "react";

const DateRangePicker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>();
  const [startTime, setStartTime] = useState<string>();
  const [endTime, setEndTime] = useState<string>();

  const [endDate, setEndDate] = useState<string>("");

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  return (
    <div className="flex items-center">
      <div className="gap-4 -mx-3 ">
        <div className="flex justify-evenly gap-2 px-3 mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            Date
          </label>

          <input
            name="start"
            type="date"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Select date start"
            disabled={true}
            value={selectedDate}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            time
          </label>

          <input
            name="start"
            type="time"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Select date start"
            disabled={true}
            value={startTime}
          />
          <label className="block text-sm font-medium text-gray-700 dark:text-white">
            time
          </label>

          <input
            name="start"
            type="time"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Select date start"
            disabled={true}
            value={endTime}
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
