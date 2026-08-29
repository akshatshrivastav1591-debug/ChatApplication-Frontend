import { useState } from "react";
import { ArrowUpIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Loader } from "../Loader";
export function MultiPartRequestComponent({
  files,
  objectUrls,
  sendingFiles,
  ShowMultiPartUi,
  loadingIndicator,
}) {
  const [fileIndex, setFileIndex] = useState(0);
  const [attachedMessages, setAttachedMessages] = useState([]);
  const [disableSendButton, SetDisableSendButton] = useState(false);

  const hasInvalidFile = files.some(
    (file) =>
      !file.type.startsWith("image/") && !file.type.startsWith("video/"),
  );

  function setFileIndexFunction(index) {
    setFileIndex(index);
  }
  function disablingSendingButton() {
    SetDisableSendButton(true);
  }
  function SettingAttachedMessages(e) {
    const value = e.target.value;
    setAttachedMessages((prevMessage) => {
      const updatedMessages = [...prevMessage];

      updatedMessages[fileIndex] = value;
      return updatedMessages;
    });
  }

  return (
    <>
      <div
        className=" justify-self-start ml-2 mt-1 active:text-gray-600 sm:hover:text-gray-500"
        onClick={ShowMultiPartUi}
      >
        <ArrowLeft />
      </div>
      <div className="flex flex-col items-center mt-3 px-3">
        {files[fileIndex].type.startsWith("image/") ? (
          <>
            <div className="flex w-full max-w-sm h-64 sm:w-56 sm:h-56 border">
              {" "}
              <img
                src={objectUrls[fileIndex]}
                alt={files[fileIndex].name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="mt-1 w-full max-w-sm" key={fileIndex}>
              <input
                type="text"
                value={attachedMessages[fileIndex]}
                className="bg-gray-100 border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={SettingAttachedMessages}
              />
            </div>
          </>
        ) : null}

        {files[fileIndex].type.startsWith("video/") ? (
          <>
            <div className="flex w-full max-w-sm h-64 sm:w-56 sm:h-56 border rounded-xl shadow-md overflow-hidden bg-white transition-all duration-200">
              {" "}
              <video
                muted
                autoPlay
                controls
                playsInline
                src={objectUrls[fileIndex]}
                alt={files[fileIndex].name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="mt-1 w-full max-w-sm" key={fileIndex}>
              <input
                type="text"
                value={attachedMessages[fileIndex]}
                className="bg-gray-100 border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={SettingAttachedMessages}
              />
            </div>
          </>
        ) : null}
      </div>
      <footer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-3 py-2.5 m-2 bg-white border border-gray-200 rounded-xl shrink-0">
        <div className="flex gap-2 mt-3 sm:mt-0 px-2 py-2 bg-gray-50 rounded-lg border overflow-x-auto max-w-full">
          {loadingIndicator ? (
            <Loader />
          ) : hasInvalidFile ? (
            <div className="flex justify-center bg-red-500 font-bold">
              Sorry,You can't send files other than images and videos!
            </div>
          ) : (
            <>
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`flex justify-center shrink-0 h-10 w-10 rounded cursor-pointer border ${
                    index === fileIndex
                      ? "border-blue-500 scale-110"
                      : "border-transparent"
                  } active:scale-105 sm:hover:scale-105 transition-transform duration-150`}
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={objectUrls[index]}
                      alt={file.name}
                      className="w-full h-full object-cover rounded"
                      onClick={() => setFileIndexFunction(index)}
                    />
                  ) : null}
                  {file.type.startsWith("video/") ? (
                    <video
                      src={objectUrls[index]}
                      alt={file.name}
                      className="w-full h-full object-cover rounded"
                      onClick={() => setFileIndexFunction(index)}
                    />
                  ) : null}
                </div>
              ))}
            </>
          )}
        </div>
        <button
          disabled={disableSendButton}
          aria-label="Send message"
          className="flex items-center justify-center w-full sm:w-9 h-9 rounded-lg bg-blue-500 text-white active:bg-blue-700 sm:hover:bg-blue-600 transition"
          onClick={() => {
            
            disablingSendingButton();
            sendingFiles(files, attachedMessages);
          }}
        >
          <ArrowUpIcon size={16} />
        </button>
      </footer>
    </>
  );
}