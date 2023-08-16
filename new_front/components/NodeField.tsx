import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  useEditableControls,
} from "@chakra-ui/react";
import { FaCheck, FaEdit } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

export default function NodeField({
  name,
  value,
  id,
}: {
  name: string;
  value: string;
  id: string;
}) {
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
    <div className="">
      <Editable
        textAlign="center"
        defaultValue={value}
        isPreviewFocusable={false}
        className="flex gap-2 items-center justify-between"
      >
        <div className="flex-1 h-8 border rounded-lg items-center justify-center">
          {name}
        </div>
        <EditablePreview className="flex-1 border rounded-lg" />
        {/* Here is the custom input */}
        <Input as={EditableInput} size="sm" />
        <EditableControls />
      </Editable>
    </div>
  );
}
