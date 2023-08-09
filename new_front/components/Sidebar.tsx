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
import { useRouter } from "next/router";

interface SidebarProps {
  children: React.ReactNode;
}

function Sidebar() {
  const pathname = useRouter().pathname;
  const routes = pathname
    ? useMemo(
        () => [
          {
            icon: BiGridAlt,
            label: "Collaboration",
            active: pathname.startsWith("/collaboration"),
            href: "/collaboration/view",
          },
          {
            icon: AiOutlineFileText,
            label: "Proposals",
            active: pathname.startsWith("/proposal"),
            href: "/proposal/view",
          },
          {
            icon: BiUser,
            label: "User Management",
            active: pathname.startsWith("/management"),
            href: "/management/view",
          },
          {
            icon: AiOutlineCheckCircle,
            label: "Decisions",
            active:
              pathname.startsWith("/decision") &&
              !pathname.startsWith("/decision-pattern"),
            href: "/decision/view",
          },
          {
            icon: AiOutlineApi,
            label: "Decision Patterns",
            active: pathname.startsWith("/decision-pattern"),
            href: "/decision-pattern/view",
          },

          {
            icon: RiFileChartLine,
            label: "Reports",
            active: pathname.startsWith("/report"),
            href: "/report/view",
          },
          {
            icon: RiFileChartLine,
            label: "Docs",
            active: pathname.startsWith("/doc"),
            href: "/doc/view",
          },
        ],
        [pathname]
      )
    : [];

  return (
    <div className="">
      <div
        className={twMerge(
          "hidden md:flex flex-col gap-y-2 h-full w-[300px] p-2"
        )}
      >
        <Box className="flex flex-col flex-grow">
          <div className="flex flex-col gap-y-4 px-5 py-4 flex-grow">
            <div className="text-4xl text-white font-bold mb-4">
              <div className="flex items-center justify-center text-4xl text-black mb-4">
                <GiBorderedShield className="w-10 h-10" />
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
                active: pathname.startsWith("/settings"),
                href: "/settings",
              }}
            />
          </div>
        </Box>
      </div>
    </div>
  );
}

export default Sidebar;
