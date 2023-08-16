"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import ToasterProvider from "@/providers/ToasterProvider";
import MainContent from "@/components/MainContent";
import { ApolloProvider } from "@apollo/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import client from "@/components/apollo-client";
const font = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Collborative Software Development",
  description: "An App on collaborative software development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={font.className}>
        <ApolloProvider client={client}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ToasterProvider />
            <Sidebar>{children}</Sidebar>
          </LocalizationProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
