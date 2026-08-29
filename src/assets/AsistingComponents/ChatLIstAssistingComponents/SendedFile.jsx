

function getFileIcon(fileName) {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return { icon: "📄", color: "bg-red-500/20", iconClass: "text-red-400", label: "PDF" };
  if (["doc", "docx"].includes(ext)) return { icon: "📝", color: "bg-white/15", iconClass: "text-white", label: "DOC" };
  if (["xls", "xlsx"].includes(ext)) return { icon: "📊", color: "bg-white/15", iconClass: "text-white", label: "XLS" };
  if (ext === "txt") return { icon: "📃", color: "bg-white/15", iconClass: "text-white", label: "TXT" };
  return { icon: "📁", color: "bg-white/15", iconClass: "text-white", label: ext?.toUpperCase() ?? "FILE" };
}

export function SendedFile({ attachedMessage, messageTiming, fileUrl, fileName, fileSize ,}) {
  const { color, label } = getFileIcon(fileName);
  return (
    <div className="flex flex-col w-full" >
      <div className="flex items-end gap-2 max-w-[72%] self-end flex-row-reverse mt-2">
        <a href={fileUrl} download className="text-white/70 flex-shrink-0 ml-auto">
        <div className="bg-blue-500 rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl px-3 pt-2.5 pb-1.5 min-w-[220px]">
          {/* File row */}
          <div className="flex items-center gap-2.5 mb-2">
            <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
              <span className="text-lg">{getFileIcon(fileName).icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate max-w-[140px]">{fileName}</p>
              <p className="text-[11px] text-white/60">{label} · {fileSize}</p>
            </div>
            
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
          
          </div>
          {attachedMessage && (
            <p className="text-sm text-white/85 leading-snug mb-1">{attachedMessage}</p>
          )}
          <div className="flex items-center justify-end gap-1">
            <span className="text-[11px] text-white/65">{messageTiming}</span>
            <svg className="w-3.5 h-3.5 text-white/65" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 12l5 5L20 7" /><path d="M9 12l5 5L20 7" />
            </svg>
          </div>
        </div>
       </a>
      </div>
    </div>
  );
}