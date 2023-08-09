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
} from "@chakra-ui/react";
import { useState } from "react";

export default function BackdropExample() {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />);

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
        <ModalContent className="flex h-[40rem]">
          <ModalHeader>Create a new Model</ModalHeader>
          <ModalCloseButton />
          <ModalBody className="flex-1">
            <div className="flex gap-y-4 h-full">
              <div className="flex-1 bg-black"></div>
              <div className="flex-1 bg-orange-600"></div>
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
