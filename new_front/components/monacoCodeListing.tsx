import Editor from "@monaco-editor/react";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";

//
// So... typings weren't working when I implemented Monaco, and we had to ship,
// so these placeholder types were put in place so tests passed... please fix
// these before going production. imo Monaco provides typings, they just didn't
// work when we tried them (VSCode wouldn't recognize them, tslint complained.)
//

export type MonacoEditorOptions = {
  stopRenderingLineAfter: number;
};

export type MonacoEditorA = MutableRefObject<any>;
export type MonacoEditorB = MutableRefObject<any>;
export type MonacoTextModal = any;

export type MonacoOnInitializePane = (
  monacoEditorRef: MonacoEditorA,
  editorRef: MonacoEditorB,
  model: MonacoTextModal
) => void;

export type ScriptEditorProps = {
  // usage: const [code, setCode] = useState<string>('default value')
  code: string;
  setCode: Dispatch<SetStateAction<string>>;

  // see: https://microsoft.github.io/monaco-editor/api/modules/monaco.editor.html
  editorOptions: MonacoEditorOptions;

  onInitializePane: MonacoOnInitializePane;
};

//
// End of placeholder typings
//

const ScriptEditor = (props: ScriptEditorProps): JSX.Element => {
  const { code, setCode, editorOptions, onInitializePane } = props;

  const monacoEditorRef = useRef<any | null>(null);
  const editorRef = useRef<any | null>(null);

  // monaco takes years to mount, so this may fire repeatedly without refs set
  useEffect(() => {
    if (monacoEditorRef?.current) {
      // again, monaco takes years to mount and load, so this may load as null
      const model: any = monacoEditorRef.current.getModels();

      if (model?.length > 0) {
        // finally, do editor's document initialization here
        onInitializePane(monacoEditorRef, editorRef, model);
      }
    }
  });

  return (
    <Editor
      // height="42.9em" // preference
      language="javascript" // preference
      onChange={(value) => {
        setCode(value as string);
      }}
      onMount={(editor, monaco) => {
        monacoEditorRef.current = monaco.editor;
        editorRef.current = editor;
      }}
      options={editorOptions}
      theme="vs-dark" // preference
      value={code}
      // width="60em" // preference
    />
  );
};

export default ScriptEditor;
