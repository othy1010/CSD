import Sidebar from "@/components/Sidebar";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
const inter = Inter({ subsets: ["latin"] });

// Adds messages only in a dev environment

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative w-screen h-screen">
      <Sidebar />
      <div className="ml-[20%] h-screen overflow-y-auto">{children}</div>
    </div>
  );
}
