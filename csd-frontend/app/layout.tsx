import "./globals.css";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import ToasterProvider from "@/providers/ToasterProvider";

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
        <ToasterProvider />

        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}
