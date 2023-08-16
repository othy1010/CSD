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
} from "@chakra-ui/react";
import { useState } from "react";
import NodeDiagram from "./NodeDiagram";
import CodeListing from "./CodeListing";
import { MdCheckCircle, MdSettings } from "react-icons/md";
import NodeField from "./NodeField";
//create a typescropt interface that'S called Node from a modal
interface Node {
  id: string;
  name: string;
  fields: Field[];
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
    id: "1",
    type: "custom",
    data: {
      name: "Attack Goal",
      fields: [
        {
          id: "1",
          name: "ID",
          type: "number",
          value: "1",
        },
      ],
    },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    type: "custom",
    data: {
      name: "Attack Objective 1",
      fields: [
        {
          id: "1",
          name: "ID",
          type: "number",
          value: "1",
        },
      ],
    },
    position: { x: 0, y: 200 },
  },
  {
    id: "3",
    type: "custom",
    data: {
      name: "Attack Objective 2",
      fields: [
        {
          id: "1",
          name: "ID",
          type: "number",
          value: "1",
        },
      ],
    },
    position: { x: 400, y: 200 },
  },
  {
    id: "4",
    type: "custom",
    data: {
      name: "Attack Objective 3",
      fields: [
        {
          id: "1",
          name: "ID",
          type: "number",
          value: "1",
        },
        {
          id: "2",
          name: "name",
          type: "string",
          value: "name",
        },
      ],
    },
    position: { x: 800, y: 200 },
  },
  {
    id: "5",
    type: "custom",
    data: {
      name: "Attack Cost",
      fields: [
        {
          id: "1",
          name: "ID",
          type: "number",
          value: "1",
        },
      ],
    },
    position: { x: 400, y: 400 },
  },
  {
    id: "6",
    type: "custom",
    data: {
      name: "Attack Cost",
      fields: [
        {
          id: "1",
          name: "ID",
          type: "number",
          value: "1",
        },
      ],
    },
    position: { x: 800, y: 400 },
  },
];

const initEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
  },
  {
    id: "e4-6",
    source: "4",
    target: "6",
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
  const [nodes, setNodes] = useState(initNodes);
  const [edges, setEdges] = useState(initEdges);
  const [nodeId, setNodeId] = useState("1");
  console.log(
    "🚀 ~ file: CustomModal.tsx:190 ~ CustomModal ~ nodeId:",
    +nodeId - 1,
    initNodes[+nodeId - 1]
  );

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
        <ModalContent className=" h-[40rem] max-h-[40rem]">
          <ModalHeader>Create a new Model</ModalHeader>
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
                  <Tab>Tab 1</Tab>
                  <Tab>Tab 2</Tab>
                </TabList>
                <TabPanels className=" ">
                  <TabPanel className=" h-full ">
                    <List spacing={3}>
                      {nodes[+nodeId - 1].data.fields.map((field) => (
                        <ListItem className="">
                          <NodeField
                            id={field.id}
                            name={field.name}
                            value={field.value}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </TabPanel>
                  <TabPanel>
                    <CodeListing className=" h-[26rem] flex-1" />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>

            <div className="flex-1 bg-black">
              <NodeDiagram
                initNodes={nodes}
                initEdges={edges}
                setNodeId={setNodeId}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
