import {
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import * as React from "react";

import dayjs from "dayjs";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
interface Field {
  name: string;
  type: {
    kind: string;
    ofType: {
      kind: string;
    };
  };
}
interface Header {
  field: string;
  headerName: string;
  minWidth: number;
  kind: string;
  type: string;
}

export default function DataTable({
  data,
  head,
}: {
  data: any;
  head: Header[];
}) {
  const isDateField = (fieldName: string) =>
    fieldName.toLowerCase().includes("date") ||
    fieldName.toLowerCase().includes("time") ||
    fieldName.toLowerCase().includes("duration");
  const formatDate = (dateValue: string) => {
    let date = new Date(dateValue);
    if (isNaN(date.getTime())) {
      console.log("Invalid Date", dayjs(dateValue));
      date = dayjs(dateValue).toDate();
    }
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  const renderTableCell = (row: any, header: Header) => {
    const pathname = useRouter().pathname;
    const routes = pathname.split("/");

    const cellValue = row[header.field];
    if (isDateField(header.field) && cellValue) {
      const formattedDate = formatDate(cellValue);
      return (
        <Td key={header.field}>
          <Link href={`/${routes[1]}/view/${row.id}`}>{formattedDate}</Link>
        </Td>
      );
    } else if (typeof cellValue === "boolean") {
      const icon = cellValue ? (
        <HiCheckCircle className="text-green-500 text-xl" />
      ) : (
        <HiXCircle className="text-red-500 text-xl" />
      );
      return (
        <Td key={header.field}>
          <Link href={`/${routes[1]}/view/${row.id}`}>{icon}</Link>
        </Td>
      );
    } else {
      return (
        <Td key={header.field}>
          <Link href={`/${routes[1]}/view/${row.id}`}>{cellValue}</Link>
        </Td>
      );
    }
  };

  return (
    <div>
      <Table variant="simple">
        <TableCaption>DataTable</TableCaption>
        <Thead>
          <Tr>
            {head.map((header) => (
              <Th key={header.field} minWidth={header.minWidth}>
                {header.headerName}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row: any, rowIndex: any) => (
            <Tr key={rowIndex}>
              {head.map((header) => renderTableCell(row, header))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
