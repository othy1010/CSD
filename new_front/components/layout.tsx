import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
const inter = Inter({ subsets: ["latin"] });

// Adds messages only in a dev environment

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex ">
      <Sidebar />
      <div className="w-full">{children}</div>
    </div>
  );
}
