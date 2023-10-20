import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

function SidebarItem({ icon: Icon, label, active, href }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={twMerge(
        `
        flex 
        flex-row 
        h-auto 
        items-center 
        w-full 
        gap-x-4 
        text-md 
        font-medium
        cursor-pointer
        hover:text-teal-500
        transition
        
        py-1`,
        active && "text-blue-500"
      )}
    >
      <Icon size={26} />
      <p className="truncate w-100">{label}</p>
    </Link>
  );
}

export default SidebarItem;
