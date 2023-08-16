import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import client from "./apollo-client";
import { gql, useMutation } from "@apollo/client";
import dayjs from "dayjs";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
const Dropzone = () => {
  const toast = useToast();

  const router = useRouter();
  const ADD_VULNERABILITY = gql`
    mutation AddVulnerability($vulnerability: AddVulnerabilityInput!) {
      addVulnerability(vulnerability: $vulnerability) {
        id
        name
      }
    }
  `;
  const [addVulnerability, { data, loading, error }] =
    useMutation(ADD_VULNERABILITY);
  const onDrop = async (acceptedFiles: any[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      console.warn("No files provided.");
      return;
    }
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const fileContent = event.target.result;

        try {
          const jsonData = JSON.parse(fileContent);

          const variables = {
            name: jsonData.containers.cna.x_legacyV4Record.CVE_data_meta.ID,
            description: jsonData.containers.cna.descriptions[0].value,
            reference: jsonData.cveMetadata.cveId.split("-")[0],
            refid: jsonData.cveMetadata.cveId,
            date: dayjs(jsonData.cveMetadata.datePublished).format(
              "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            ),
          };

          await AddVulnerability(variables);
        } catch (error) {
          console.error("Error processing the uploaded file:", error);
        }
      };

      if (error) {
        toast({
          title: "An error occurred, try again.",
          description: error.message,
          position: "top",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Vulnerability Added succesfully.",
          position: "top",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        //redirect to vulnerability page
        router.push(`/vulnerability/view`);
      }
    });
  };

  async function AddVulnerability(variables: any) {
    try {
      await addVulnerability({
        variables: {
          vulnerability: variables,
        },
      });
    } catch (error) {}
  }
  const {
    getRootProps,
    getInputProps,
    isDragReject,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    accept: {
      "application/json": [],
    },
    onDrop,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-dashed border-4 border-gray-300 p-6 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition duration-300 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-2 flex flex-col">
          <i className="text-4xl  self-center">
            <FiUploadCloud />
          </i>
          <p>Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">
            Only Json ( .json) files are accepted
          </p>
        </div>
        {isDragReject && (
          <p className="mt-2 text-red-600">
            Invalid file type. Please upload a file.
          </p>
        )}
      </div>
      {fileRejections.length > 0 && (
        <ul className="mt-2 text-red-600">
          {fileRejections.map(({ file, errors }) => (
            <li key={file.name}>
              {file.name} - {errors.map((e) => e.message).join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropzone;
