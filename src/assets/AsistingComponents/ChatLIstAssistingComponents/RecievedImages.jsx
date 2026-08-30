import { DeleteMessageOptionUiForRecievedMessage } from "../../DeleteMessageOptionUiForRecievedMEssage";
export function ReceivedImages({
  attachedMessages,
  receivedImages,
  messageTiming,
  viewFile,
  index,
  selectedIndex,
  deletedForOneSide,
   onSelected,
}) {
  return (
    <>{
       selectedIndex===index?<DeleteMessageOptionUiForRecievedMessage onDelete={deletedForOneSide} closeTab={onSelected} viewFile={viewFile}/>:
      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[80%] self-start mt-3">
  <img
    src={receivedImages}
    alt="avatar"
    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
  />
  <div className="bg-white rounded-tl-sm rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-gray-100 overflow-hidden" onClick={onSelected}>
    <img
      src={receivedImages}
      alt="received"
      className="w-48 h-32 sm:w-60 sm:h-40 object-cover"
    />
    <div className="px-3 pt-2 pb-1.5">
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
}
    </>
  );
}
