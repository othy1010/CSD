import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useState } from "react";

function Datepick({
  value2,
  setValue2,
}: {
  value2: Date | null | undefined;
  setValue2: (newValue: Date | null) => void;
}) {
  return (
    <DatePicker
      label="Start Date"
      value={value2}
      onChange={(newValue) => {
        setValue2(newValue);
      }}
    />
  );
}

export default Datepick;
