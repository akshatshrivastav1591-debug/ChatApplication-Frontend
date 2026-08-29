import { useState } from "react";
import {DeleteMessageOptionUiForRecievedMessage } from "../../assets/DeleteMessageOptionUiForRecievedMEssage";


export function ReceivedGroupMessages({
  receivedMessagesContent,
  messagesTiming,
  index,
  selectedIndex,
  deletedMessage,
  onSelected,
  senderName,
  senderPicture,
  Logo
}) 
{
  const [errorImage,setErrorImage]=useState(false);
  return (
    <>
      {selectedIndex === index ? (
        <DeleteMessageOptionUiForRecievedMessage
          onDelete={deletedMessage}
          closeTab={onSelected} 
         viewFile={null}
        />
        
      ) : (
        <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[70%] self-start mt-3">
          <img
            src={!senderPicture||errorImage ?Logo:senderPicture}
            alt={senderName}
            className="w-6 h-6 rounded-full object-cover shrink-0"
            onError={()=>{
              setErrorImage(true);
            }}
          />
          <div
            className="bg-white w-fit min-w-0 p-2 rounded-xl flex flex-col"
            onClick={onSelected}
          >
            <span className="text-xs font-semibold text-blue-600 mb-0.5 truncate">
              {senderName}
            </span>
            <p className="text-sm font-bold break-words">{receivedMessagesContent}</p>
            <span className="text-xs text-black opacity-60 self-end">
              {messagesTiming}
            </span>
          </div>
        </div>
      )}
    </>
  );
}