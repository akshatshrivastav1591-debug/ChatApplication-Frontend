import { FileText, FileArchive, Paperclip } from "lucide-react";

 export function getFileIcon(type) {
  if (type === "application/pdf") return <FileText size={40} />;
  if (type.includes("zip") || type.includes("rar")) return <FileArchive size={40} />;
  return <Paperclip size={40} />;
}