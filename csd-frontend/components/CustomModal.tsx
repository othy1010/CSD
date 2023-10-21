// @ts-nocheck
import {
  ModalOverlay,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  List,
  ListIcon,
  ListItem,
  Input,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NodeDiagram from "./DiagramManip/NodeDiagram";
import CodeListing from "./CodeListing";
import { MdCheckCircle, MdSettings } from "react-icons/md";
import NodeField from "./DiagramManip/NodeField";
import { MarkerType, useEdgesState, useNodesState } from "reactflow";
import NodeFields from "./DiagramManip/NodeFields";
import EcoreConverter from "./DiagramManip/EcoreConverter";
import { BsExclamationCircleFill, BsBugFill } from "react-icons/bs";
import { FaShieldVirus } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
//create a typescropt interface that'S called Node from a modal
interface Node {
  id: string;
  name: string;
  fields: Field[];
  isProblematic?: boolean;
}
interface Field {
  id: string;
  name: string;
  type: Types;
  value: string;
}
enum Types {
  string,
  number,
  boolean,
  array,
  object,
}
const initNodes = [
  {
    id: "B",
    type: "custom",
    data: {
      name: "Class A",
      isProblematic: true,
      fields: [
        {
          id: "content",
          name: "content",
          type: "string",
          value:
            "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString",
        },
      ],
    },
    position: {
      x: 0,
      y: 0,
    },
  },
  {
    id: "G",
    type: "custom",
    data: {
      name: "Class B",
      fields: [
        {
          id: "content",
          name: "content",
          type: "string",
          value:
            "ecore:EDataType http://www.eclipse.org/emf/2002/Ecore#//EString",
        },
      ],
    },
    position: {
      x: 200,
      y: 300,
    },
  },
];

const initEdges = [
  {
    id: "B->G",
    source: "B",
    target: "G",
    markerEnd: "compositionSVG",
    type: "smoothstep",

    style: {
      strokeWidth: 2,
      stroke: "#000000",
    },
  },
];

export default function CustomModal() {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [nodeId, setNodeId] = useState("1");

  const handleNodeFieldChange = (
    nodeId: string,
    fieldId: string,
    newValue: any
  ) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === nodeId) {
        const updatedFields = node.data.fields.map((field) => {
          if (field.id === fieldId) {
            return { ...field, value: newValue };
          }
          return field;
        });

        return { ...node, data: { ...node.data, fields: updatedFields } };
      }
      return node;
    });

    setNodes(updatedNodes);
  };

  return (
    <>
      <Button
        onClick={() => {
          setOverlay(<OverlayOne />);
          onOpen();
        }}
      >
        Add a Model
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose} size={"6xl"}>
        {overlay}
        <ModalContent className=" z-0 h-[40rem] max-h-[40rem]">
          <ModalHeader>
            <div className="flex items-center gap-2">
              <div className="">Create a new Model</div>
              <div className="">
                <EcoreConverter setNodes={setNodes} setEdges={setEdges} />
              </div>
              <Button
                leftIcon={<FiUploadCloud />}
                variant="solid"
                className="bg-green-100 text-blue-800"
                onClick={() => {
                  const fileInput = document.getElementById("ecoreFileInput");
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
              >
                Export to Ecore Model
              </Button>
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex">
            <div className="flex-1">
              <Tabs
                isFitted
                variant="soft-rounded"
                colorScheme="green"
                className="h-full"
              >
                <TabList>
                  <Tab>Entities</Tab>
                  <Tab>CSD diagram DSL</Tab>
                </TabList>
                <TabPanels className=" ">
                  <TabPanel className=" h-full ">
                    <NodeFields
                      node={nodes.find((n) => n.id === nodeId)}
                      onFieldChange={handleNodeFieldChange}
                      setNodes={setNodes}
                    />
                  </TabPanel>

                  <TabPanel>
                    <CodeListing
                      className=" h-[26rem] flex-1"
                      nodes={nodes}
                      setNodes={setNodes}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>

            <div className="flex-1 bg-black">
              <NodeDiagram
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                setNodeId={setNodeId}
                setEdges={setEdges}
                setNodes={setNodes}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3}>
              Save
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
