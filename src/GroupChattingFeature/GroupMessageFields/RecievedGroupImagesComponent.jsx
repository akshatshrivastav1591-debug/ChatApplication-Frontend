import { DeleteMessageOptionUiForRecievedMessage } from "../../assets/DeleteMessageOptionUiForRecievedMEssage";
import { useState } from "react";
export function ReceivedGroupImages({
  attachedMessages,
  receivedImages,
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
        <div className="flex justify-start w-full mt-2" onClick={onSelected}>
          <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[80%] self-start mt-3">
            <img
              src={!senderPicture||errorImage?Logo:senderPicture}
              alt={senderName}
              className="w-6 h-6 rounded-full object-cover shrink-0"
              onError={()=>{
              setErrorImage(true);
            }}
            />

            <div className="bg-white rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100 overflow-hidden min-w-0">
              <img
                src={receivedImages}
                alt="received"
                className="w-48 h-32 sm:w-60 sm:h-40 object-cover"
                onError={()=>{
              setErrorImage(true);
            }}
              />

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