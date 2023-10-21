import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";

import Button from "./Button";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
        h-fit 
        border
        rounded-lg
        p-2
        m-2
        `,
        className
      )}
    >
      <div className="w-full flex gap-10 items-center justify-between ">
        <div className="hidden md:flex gap-x-2 w-full items-center">
          <InputGroup className="">
            <InputLeftElement pointerEvents="none">
              <BiSearch className="text-gray-400" />
            </InputLeftElement>
            <Input placeholder="Search" size="md" />
          </InputGroup>
        </div>
        <div className="flex md:hidden gap-x-2 items-center">
          <button
            className="
              rounded-full 
              p-2 
              bg-white 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          >
            <HiHome className="text-black" size={20} />
          </button>
          <button
            className="
              rounded-full 
              p-2 
              flex 
              items-center 
              justify-center 
              cursor-pointer 
              hover:opacity-75 
              transition
            "
          ></button>
        </div>
        <div className="flex justify-between items-center gap-x-4">
          {true ? (
            <div className="flex gap-x-4 items-center">
              <Button className=" px-6 py-2">Logout</Button>
              <Button className="bg-white">
                <FaUserAlt />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <Button
                  className="
                    bg-transparent 
                    font-medium
                  "
                >
                  Sign up
                </Button>
              </div>
              <div>
                <Button className="bg-white px-6 py-2">Log in</Button>
              </div>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
