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
import { MdSecurity } from "react-icons/md";

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
            icon: MdSecurity,
            label: "Security",
            active: pathname.startsWith("/security"),
            href: "/security/view",
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
            icon: BiUser,
            label: "User Management",
            active: pathname.startsWith("/management"),
            href: "/management/view",
          },
        ],
        [pathname]
      )
    : [];

  return (
    <div className="fixed left-0 top-0 h-full w-[20%] p-2">
      <div
        className={twMerge(
          "hidden md:flex flex-col gap-y-2 h-full border border-gray-200 rounded-lg p-2"
        )}
      >
        <div
          className={twMerge(`flex flex-col flex-grow 
        bg-white
        rounded-lg 
        h-fit 
        w-full `)}
        >
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
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
