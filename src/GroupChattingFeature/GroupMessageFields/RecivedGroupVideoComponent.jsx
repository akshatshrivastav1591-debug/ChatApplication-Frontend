import { useState } from "react";
import {DeleteMessageOptionUiForRecievedMessage } from "../../assets/DeleteMessageOptionUiForRecievedMEssage";
export function ReceivedGroupVideos({
  attachedMessages,
  videoUrl,
  messageTiming,
  viewFile,
  index,
  selectedIndex,
  deletedForOneSide,
  onSelected,
  senderName,
  senderPicture,
  Logo
}) {
  const [errorImage,setErrorImage]=useState(false);
  return (
    <>
      {selectedIndex === index ? (
        <DeleteMessageOptionUiForRecievedMessage
          onDelete={deletedForOneSide}
          closeTab={onSelected}
          viewFile={viewFile}
        />
      ) : (
        <div className="flex flex-col w-full" onClick={onSelected}>
          <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[72%] self-start mt-3">
            <img
              src={!senderPicture||errorImage?Logo:senderPicture}
              alt={senderName}
              className="w-6 h-6 rounded-full object-cover shrink-0"
              onError={()=>{
                setErrorImage(true);
              }}
            />

            <div className="bg-white rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100 overflow-hidden min-w-0">
              <div className="w-48 h-28 sm:w-60 sm:h-36 bg-[#1a1a2e] flex items-center justify-center relative">
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 flex items-center justify-center z-10">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-white ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="px-3 pt-2 pb-1.5">
                <span className="text-xs font-semibold text-blue-600 block mb-1 truncate">
                  {senderName}
                </span>
                {attachedMessages && (
                  <p className="text-sm text-gray-800 leading-snug mb-1 break-words">
                    {attachedMessages}
                  </p>
                )}
                <span className="text-[11px] text-gray-400 block text-right">
                  {messageTiming}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}