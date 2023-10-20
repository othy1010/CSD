import { twMerge } from "tailwind-merge";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box: React.FC<BoxProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge(
        `
        border
        border-gray-200
        bg-white
        rounded-lg 
        h-fit 
        w-full
        `,
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
