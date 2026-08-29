import { useState } from "react";

export function ViewFilesComponent({ files, closingFunction }) {
  if (files === null) {
    return;
  }
  const [fileIndex, setFileIndex] = useState(0);

  function setFileIndexFunction(index) {
    setFileIndex(index);
  }

  return (
    <>
      <div className="flex flex-col items-center mt-3 px-3">
        {files[fileIndex].fileType === "image" ? (
          <>
            <div className="flex w-full max-w-sm h-64 sm:w-56 sm:h-56 border">
              {" "}
              <img
                src={files[fileIndex].fileUrl}
                alt={files[fileIndex].name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </>
        ) : null}

        {files[fileIndex].fileType === "video" ? (
          <>
            <div className="flex w-full max-w-sm h-64 sm:w-56 sm:h-56 border rounded-xl shadow-md overflow-hidden bg-white transition-all duration-200">
              {" "}
              <video
                muted
                autoPlay
                controls
                playsInline
                src={files[fileIndex].fileUrl}
                alt={files[fileIndex].name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          </>
        ) : null}

        {!files[fileIndex].fileType === "image" &&
        !files[fileIndex].fileType === "video" ? (
          <>
            <div className="flex flex-col w-full max-w-sm h-64 sm:w-56 sm:h-56 border rounded bg-gray-100 items-center justify-center">
              {files[fileIndex].type === "application/pdf" ? (
                <iframe
                  src={files[fileIndex].fileUrl}
                  className="w-full h-full"
                  title={files[fileIndex].name}
                />
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-2">
                    Preview not available
                  </p>

                  <a
                    href={files[fileIndex].fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    Open File
                  </a>
                </>
              )}
            </div>
          </>
        ) : null}
      </div>
      <footer className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 px-3 py-2.5 m-2 bg-white border border-gray-200 rounded-xl shrink-0">
        <div className="flex gap-2 mt-3 sm:mt-0 px-2 py-2 bg-gray-50 rounded-lg border overflow-x-auto max-w-full">
          {files.map((file, index) => (
            <div
              key={index}
              className={`flex justify-center shrink-0 h-10 w-10 rounded cursor-pointer border ${
                index === fileIndex
                  ? "border-blue-500 scale-110"
                  : "border-transparent"
              } active:scale-105 sm:hover:scale-105 transition-transform duration-150`}
            >
              {file.fileType === "image" ? (
                <img
                  src={files[index].fileUrl}
                  alt={file.name}
                  className="w-full h-full object-cover rounded"
                  onClick={() => setFileIndexFunction(index)}
                />
              ) : null}
              {file.fileType === "video" ? (
                <video
                  src={files[index].fileUrl}
                  alt={file.name}
                  className="w-full h-full object-cover rounded"
                  onClick={() => setFileIndexFunction(index)}
                />
              ) : null}
            </div>
          ))}
        </div>
        <button
          aria-label="Send message"
          className="flex items-center justify-center w-full sm:w-9 h-9 rounded-lg bg-blue-500 text-white active:bg-blue-600 sm:hover:bg-blue-600 transition"
          onClick={closingFunction}
        >
          close
        </button>
      </footer>
    </>
  );
}
