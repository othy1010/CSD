import { Button } from "@chakra-ui/react";
import React from "react";
import * as xmljs from "xml-js";
import { FiUploadCloud } from "react-icons/fi";

interface Field {
  id: string;
  name: string;
  type: string;
  value: string;
}

interface Node {
  id: string;
  type: string;
  data: {
    name: string;
    fields: Field[];
  };
  position: { x: number; y: number };
}

interface Link {
  id: string;
  type: string;
  source: string;
  target: string;
  animated: boolean;
  markerEnd: string;
  style: { stroke: string };
}

interface EcoreConverterProps {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Link[]>>;
}

const mapEcoreTypeToUserFriendlyType = (eType: string): string => {
  const mappings: { [key: string]: string } = {
    "http://www.eclipse.org/emf/2002/Ecore#//EString": "Text (EString)",
    "http://www.eclipse.org/emf/2002/Ecore#//EInt": "Integer (EInt)",
    // Add more mappings here
  };

  return mappings[eType] || eType;
};

const createFormattedClasses = (classes: any[]): Node[] => {
  return classes.map((c) => ({
    id: c.attributes.name,
    type: "custom",
    data: {
      name: c.attributes.name,
      fields: c.elements.map((e: any) => ({
        id: e.attributes.name,
        name: e.attributes.name,
        type: "string",
        value: e.attributes.eType.startsWith("http://")
          ? mapEcoreTypeToUserFriendlyType(e.attributes.eType)
          : e.attributes.eType.split("#//")[1], // This will take care of "#//Process" like types
      })),
    },
    position: { x: 0, y: 0 },
  }));
};

const createLinks = (classes: any[]): Link[] => {
  const links: Link[] = [];

  classes.forEach((c) => {
    c.elements.forEach((e: any) => {
      const [_, target] = e.attributes.eType.split("#//");
      const link: Link = {
        id: `${c.attributes.name}-${e.attributes.name}`,
        type: "smoothstep",
        source: c.attributes.name,
        target,
        animated: false,
        markerEnd: c.attributes.eType?.includes("ecore:EClass")
          ? "InheritanceSVG"
          : "compositionSVG",
        style: { stroke: "#000" },
      };

      links.push(link);
    });
  });

  return links;
};

const EcoreConverter: React.FC<EcoreConverterProps> = ({
  setNodes,
  setEdges,
}) => {
  const handleFileInputChange = (event: any) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target?.result) {
          return;
        }

        const jsonResult = xmljs.xml2js(e.target.result as string, {
          compact: false,
        });
        const classes = jsonResult.elements[0].elements;

        const formattedClasses = createFormattedClasses(classes);
        console.log(
          "🚀 ~ file: EcoreConverter.tsx:110 ~ handleFileInputChange ~ formattedClasses:",
          formattedClasses
        );
        const links = createLinks(classes);

        setNodes(formattedClasses);
        setEdges(links);
      };

      reader.readAsText(selectedFile);
      event.target.value = null; // Reset the input to allow selecting the same file again
    }
  };

  return (
    <>
      <input
        type="file"
        id="ecoreFileInput"
        style={{ display: "none" }}
        accept=".ecore"
        onChange={handleFileInputChange}
      />
      <Button
        leftIcon={<FiUploadCloud />}
        variant="solid"
        className="bg-green-100 text-green-800"
        onClick={() => {
          const fileInput = document.getElementById("ecoreFileInput");
          if (fileInput) {
            fileInput.click();
          }
        }}
      >
        Import Ecore file
      </Button>
    </>
  );
};

export default EcoreConverter;
