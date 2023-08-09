
import  { loremIpsum } from "react-lorem-ipsum";
import Image from "next/image";
import { GiBorderedShield } from "react-icons/gi";

const CollaborationModels = () => {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 relative">
          <GiBorderedShield 
            className="absolute top-0 left-0 w-full h-full text-sky-500"
          />
          </div>
          <div className="flex flex-col">
            <div className="text-lg font-semibold">Model Name</div>
            <div className="text-sm text-gray-500">Model Description</div>
          </div>
        </div>
      </div>
      

    );
  };
  
export default CollaborationModels;
  