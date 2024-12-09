import PropTypes from "prop-types";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudIcon, FolderOpenIcon } from "@heroicons/react/24/outline";
import { processImageAndChat } from "../../utils/AutoICS.js";

const ImageUploadProcessor = ({ onProcessImage, currentIndex }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFile = async (file) => {
    if (!file) {
      console.error("No file provided to handleFile.");
      return; // Guard clause to avoid undefined references
    }

    try {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsProcessing(true);
      setIsSuccess(false); // Reset success state

      const result = await processImageAndChat(file);

      // Retrieve existing calendars from localStorage
      const existingCalendars = JSON.parse(localStorage.getItem("calendars")) || [];

      // Update the calendar at the currentIndex
      if (!existingCalendars[currentIndex]) {
        console.error(`No calendar exists at index ${currentIndex}.`);
        return;
      }

      existingCalendars[currentIndex] = {
        ...existingCalendars[currentIndex],
        ...result.calendars[0], // Merge processed data into the current calendar
      };

      // Save updated calendars back to localStorage
      localStorage.setItem("calendars", JSON.stringify(existingCalendars));

      setIsSuccess(true); // Show success message
      onProcessImage(result); // Pass processed data to the parent component
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      console.log("File dropped:", acceptedFiles[0]); // Debugging
      handleFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/png",
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Processing State */}
      {isProcessing ? (
        <div className="w-64 h-64 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-lg">
          <p className="text-gray-500 font-medium">Processing...</p>
        </div>
      ) : previewUrl ? (
        /* Preview Area */
        <div className="w-64 h-64 flex items-center justify-center bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Uploaded Preview"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        /* Drag-and-Drop Box */
        <div
          {...getRootProps()}
          className={`flex items-center justify-center w-64 h-64 bg-gray-100 border-2 border-dashed rounded-lg cursor-pointer transition ${
            isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <CloudIcon className="w-12 h-12 text-gray-400 mb-2" />
            {isDragActive ? (
              <p className="text-gray-600 font-medium">Drop your image here...</p>
            ) : (
              <p className="text-gray-600 font-medium">Drag & drop to upload</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Supported formats: PNG</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="text-center font-medium">Success! Data has been processed.</p>
        </div>
      )}

      {/* OR Divider */}
      <div className="flex items-center gap-2 text-gray-500">
        <span className="border-t border-gray-300 w-12"></span>
        <span className="text-sm font-medium">OR</span>
        <span className="border-t border-gray-300 w-12"></span>
      </div>

      {/* File Explorer Button */}
      {!isProcessing && (
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition"
        >
          <FolderOpenIcon className="w-5 h-5" />
          <span>Use File Explorer</span>
          <input
            id="file-upload"
            type="file"
            accept="image/png"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              console.log("File selected via file explorer:", selectedFile); // Debugging
              if (selectedFile) {
                handleFile(selectedFile);
              }
            }}
          />
        </label>
      )}
    </div>
  );
};

ImageUploadProcessor.propTypes = {
  onProcessImage: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired, // Added currentIndex as a required prop
};

export default ImageUploadProcessor;
