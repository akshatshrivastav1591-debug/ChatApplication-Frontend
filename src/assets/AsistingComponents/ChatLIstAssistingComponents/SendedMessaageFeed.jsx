import { DeleteMessageOptionUi } from "../../DeleteMessageOption";
export function SendedMessageField({
  sendedMessageContent,
  messageTiming,
  onSelected,
  index,
  selectedIndex,
  deleteMessage,
  deleteForAll,
}) {
  return (
    <>
      {selectedIndex === index ? (
        <div className="self-end w-fit max-w-[70%] mt-2">
          <DeleteMessageOptionUi
            onDelete={deleteMessage}
            closeTab={onSelected}
            deleteForAll={deleteForAll}
            viewFile={null}
          />
        </div>
      ) : (
        <div
          className="bg-blue-400 w-fit max-w-[85%] sm:max-w-[70%] self-end p-2 rounded-xl flex flex-col mt-2"
          onClick={() => onSelected(index)}
        >
          <p className="text-sm text-white font-bold break-words">
            {sendedMessageContent}
          </p>
          <span className="text-xs text-white opacity-60 self-end">
            {messageTiming}
          </span>
        </div>
      )}
    </>
  );
}
