import { Textarea, Button, Flex, Box } from "@chakra-ui/react";
import React, { useState } from "react";
import ScriptEditor, { MonacoOnInitializePane } from "./monacoCodeListing";
import { FaCheckCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

function CodeListing({ className }: { className?: string }) {
  const x = {
    nodes: [
      {
        id: "1",
        type: "custom",
        data: {
          name: "Attack Goal",
          job: "",
        },
        position: { x: 0, y: 0 },
      },
      {
        id: "2",
        type: "custom",
        data: {
          name: "Attack Objective 1",
          job: "email",
        },
        position: { x: 0, y: 200 },
      },
      {
        id: "3",
        type: "custom",
        data: {
          name: "Attack Objective 2",
          job: "media",
        },
        position: { x: 400, y: 200 },
      },
      {
        id: "4",
        type: "custom",
        data: {
          name: "Attack Objective 3",
          job: "Mobile App",
        },
        position: { x: 800, y: 200 },
      },
      {
        id: "5",
        type: "custom",
        data: {
          name: "Attack Cost",
          job: "10.000$",
        },
        position: { x: 400, y: 400 },
      },
      {
        id: "6",
        type: "custom",
        data: {
          name: "Attack Cost",
          job: "5.000$",
        },
        position: { x: 800, y: 400 },
      },
    ],
  };
  const myJSON = JSON.stringify(x, null, 2);
  const [code, setCode] = useState<string>(myJSON);

  const onInitializePane: MonacoOnInitializePane = (
    monacoEditorRef,
    editorRef,
    model
  ) => {
    // editorRef.current.setScrollTop(1);
    // editorRef.current.setPosition({
    //   lineNumber: 2,
    //   column: 0,
    // });
    editorRef.current.focus();
    monacoEditorRef.current.setModelMarkers(model[0], "owner", null);
  };

  return (
    <div
      className={twMerge(
        `
      `,
        className
      )}
    >
      <ScriptEditor
        code={code}
        setCode={setCode}
        editorOptions={{
          stopRenderingLineAfter: 1000,
        }}
        onInitializePane={onInitializePane}
      />
    </div>
  );
}

export default CodeListing;
