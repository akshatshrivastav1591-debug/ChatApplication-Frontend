import { DeleteMessageOptionUiForRecievedMessage } from "../../DeleteMessageOptionUiForRecievedMEssage";

export function ReceivedMessages({
  receivedMessagesContent,
  messagesTiming,
  index,
  selectedIndex,
  deletedMessage,
  onSelected,
}) {
  return (
    <>
      {selectedIndex === index ? (
        <DeleteMessageOptionUiForRecievedMessage
          onDelete={deletedMessage}
          closeTab={onSelected}
          viewFile={null}
        />
      ) : (
        <div
          className="bg-white w-fit max-w-[85%] sm:max-w-[70%] self-start p-2 rounded-xl flex flex-col mt-3"
          onClick={() => onSelected(index)}
        >
          <p className="text-sm font-bold break-words">
            {receivedMessagesContent}
          </p>
          <span className="text-xs text-black opacity-60 self-end">
            {messagesTiming}
          </span>
        </div>
      )}
    </>
  );
}
