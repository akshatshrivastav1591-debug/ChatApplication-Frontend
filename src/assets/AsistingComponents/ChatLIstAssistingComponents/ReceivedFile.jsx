function getFileIcon(fileName) {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (ext === "pdf")
    return { bg: "bg-red-50", iconColor: "text-red-500", label: "PDF" };
  if (["doc", "docx"].includes(ext))
    return { bg: "bg-blue-50", iconColor: "text-blue-500", label: "DOC" };
  if (["xls", "xlsx"].includes(ext))
    return { bg: "bg-green-50", iconColor: "text-green-600", label: "XLS" };
  if (ext === "txt")
    return { bg: "bg-gray-100", iconColor: "text-gray-500", label: "TXT" };
  return {
    bg: "bg-gray-100",
    iconColor: "text-gray-500",
    label: ext?.toUpperCase() ?? "FILE",
  };
}

export function ReceivedFile({
  attachedMessages,
  messageTiming,
  fileUrl,
  fileName,
  fileSize,
}) {
  const { bg, iconColor, label } = getFileIcon(fileName);
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-end gap-2 max-w-[72%] self-start mt-3">
        <a
          href={fileUrl}
          download
          className="text-gray-400 flex-shrink-0 ml-auto"
        >
          <div className="bg-white rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100 px-3 pt-2.5 pb-1.5 min-w-[220px]">
            <div className="flex items-center gap-2.5 mb-2">
              <div
                className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
              >
                <svg
                  className={`w-5 h-5 ${iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">
                  {fileName}
                </p>
                <p className="text-[11px] text-gray-400">
                  {label} · {fileSize}
                </p>
              </div>

              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            {attachedMessages && (
              <p className="text-sm text-gray-700 leading-snug mb-1">
                {attachedMessages}
              </p>
            )}
            <span className="text-[11px] text-gray-400 block text-right">
              {messageTiming}
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}
