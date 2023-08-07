"use client"
import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import ToasterProvider from "@/providers/ToasterProvider";
import MainContent from "@/components/MainContent";
import { ApolloProvider } from '@apollo/client';

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
    <html lang="en">
      <body className={font.className}>
        <ApolloProvider client={client}>
          <ToasterProvider />
          <Sidebar>{children}</Sidebar>
        </ApolloProvider>
      </body>
    </html>
  );
}
