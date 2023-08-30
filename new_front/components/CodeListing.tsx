import { Textarea, Button, Flex, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ScriptEditor, { MonacoOnInitializePane } from "./monacoCodeListing";
import { FaCheckCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

function CodeListing({
  className,
  nodes,
  setNodes,
}: {
  className?: string;
  nodes: any;
  setNodes: any;
}) {
  const myJSON = JSON.stringify(nodes, null, 2);
  const [code, setCode] = useState<string>(myJSON);

  useEffect(() => {
    setCode(myJSON);
  }, [nodes]);

  // useEffect(() => {
  //   try {
  //     const parsedCode = JSON.parse(code);
  //     setNodes(parsedCode);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [code]);
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
