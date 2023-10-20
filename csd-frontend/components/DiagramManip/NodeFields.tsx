import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  List,
  useEditableControls,
} from "@chakra-ui/react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  PromiseLikeOfReactNode,
  useEffect,
  useState,
} from "react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

export default function NodeFields({
  node,
  onFieldChange,
  setNodes,
}: {
  node: any;
  onFieldChange: any;
  setNodes: any;
}) {
  // console.log("🚀 ~ file: NodeFields.tsx:33 ~ node:", node);
  /* Here's a custom control */
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton icon={<FaCheck />} {...getSubmitButtonProps()} />
        <IconButton icon={<GiCancel />} {...getCancelButtonProps()} />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton size="sm" icon={<FaEdit />} {...getEditButtonProps()} />
      </Flex>
    );
  }

  return (
    <List spacing={3}>
      {node && (
        <div className="flex gap-2 p-1 flex-row justify-center items-center bg-yellow-100 rounded-lg cursor-pointer">
          <Editable
            textAlign="center"
            defaultValue={node.data.name}
            isPreviewFocusable={false}
            className="flex gap-2 items-center justify-between"
          >
            <EditablePreview className="flex-1 " />
            <Input
              as={EditableInput}
              size="sm"
              onChange={(event) => {
                setNodes((nodes: any) => {
                  const newNodes = nodes.map((n: any) => {
                    if (n.id === node.id) {
                      return {
                        ...n,
                        data: {
                          ...n.data,
                          name: event.target.value,
                        },
                      };
                    }
                    return n;
                  });
                  return newNodes;
                });
              }}
            />
            <EditableControls />
          </Editable>
        </div>
      )}
      {node &&
        node.data &&
        node.data.fields &&
        node.data.fields.map((field: any) => {
          return (
            <div key={field.id} className="">
              <Editable
                textAlign="center"
                defaultValue={field.value}
                isPreviewFocusable={false}
                className="flex gap-2 items-center justify-between"
              >
                <div className="flex-1 h-8 border rounded-lg items-center justify-center">
                  {field.name}
                </div>
                <EditablePreview className="flex-1 border rounded-lg" />
                <Input
                  as={EditableInput}
                  size="sm"
                  onChange={(event) => {
                    onFieldChange(node.id, field.id, event.target.value);
                  }}
                />
                <EditableControls />
              </Editable>
            </div>
          );
        })}
      {node && (
        <div
          className="flex gap-2 p-1 flex-row justify-center items-center bg-green-100 rounded-lg cursor-pointer"
          onClick={() => {
            node.data.fields.push({
              id: "new-field",
              name: "new field",
              value: "new value",
            });
            onFieldChange(node.id, "new-field", "new value");
          }}
        >
          <FaEdit />
          add a field
        </div>
      )}
    </List>
  );
}
