"use client";

import { HiOutlineHome } from "react-icons/hi";
import { BiGridAlt } from "react-icons/bi";
import {
  AiOutlineFileText,
  AiOutlineCheckCircle,
  AiOutlineApi,
} from "react-icons/ai";
import { BiUser, BiCog } from "react-icons/bi";
import { RiFileChartLine } from "react-icons/ri";
import { GiBorderedShield } from "react-icons/gi";

import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

import SidebarItem from "./SidebarItem";
import Box from "./Box";
import { useMemo } from "react";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        icon: HiOutlineHome,
        label: "Dashboard",
        active: pathname === "/",
        href: "/",
      },
      {
        icon: BiGridAlt,
        label: "Collaborations",
        active: pathname === "/collaborations",
        href: "/collaborations",
      },
      {
        icon: AiOutlineFileText,
        label: "Proposals",
        active: pathname === "/proposals",
        href: "/proposals",
      },
      {
        icon: AiOutlineCheckCircle,
        label: "Decisions",
        active: pathname === "/decisions",
        href: "/decisions",
      },
      {
        icon: AiOutlineApi,
        label: "Decision Patterns",
        active: pathname === "/decision-patterns",
        href: "/decision-patterns",
      },

      {
        icon: BiUser,
        label: "User Management",
        active: pathname === "/user-management",
        href: "/user-management",
      },
      {
        icon: RiFileChartLine,
        label: "Reports",
        active: pathname === "/reports",
        href: "/reports",
      },
      {
        icon: RiFileChartLine,
        label: "Docs",
        active: pathname === "/doc",
        href: "/doc",
      },
    ],
    [pathname]
  );

  return (
    <div className="flex h-full">
      <div
        className={twMerge(
          "hidden md:flex flex-col gap-y-2 bg-black h-full w-[300px] p-2"
        )}
      >
        <Box className="flex flex-col flex-grow">
          <div className="flex flex-col gap-y-4 px-5 py-4 flex-grow">
            <div className="text-4xl text-white font-bold mb-4">
              <div className="flex items-center justify-center text-4xl text-white mb-4">
                <GiBorderedShield />
              </div>
            </div>
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
            <div className="flex-grow" /> {/* Spacer */}
          </div>
          <div className="flex flex-col gap-y-4 px-5 py-4">
            <SidebarItem
              key={"Setting"}
              {...{
                icon: BiCog,
                label: "Settings",
                active: pathname === "/settings",
                href: "/settings",
              }}
            />
          </div>
        </Box>
      </div>
      <main className="h-full flex-1 overflow-y-auto p-2">{children}</main>
    </div>
  );
};

export default Sidebar;
