import { DeleteMessageOptionUi } from "../../DeleteMessageOption";
export function SendedImageComponent({
  attachedMessage,
  messageTiming,
  sendedImageUrl,
  viewFile,
  index,
  selectedIndex,
  onSelected,
  deleteForOneSide,
  deleteForAllSide,
}) {
  return (
    <>
      {selectedIndex === index ? (
        <div className="flex justify-end w-full mt-2">
          <div className="w-fit max-w-[70%]">
            <DeleteMessageOptionUi
              onDelete={deleteForOneSide}
              closeTab={onSelected}
              deleteForAll={deleteForAllSide}
              viewFile={viewFile}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-end w-full mt-2" onClick={onSelected}>
          <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[72%] self-end flex-row-reverse mt-2">
            <div className="bg-blue-500 rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl overflow-hidden">
              <img
                src={sendedImageUrl}
                alt="sent"
                className="w-48 h-32 sm:w-60 sm:h-40 object-cover"
              />
              <div className="px-3 pt-2 pb-1.5">
                {attachedMessage && (
                  <p className="text-sm text-white leading-snug mb-1 break-words">
                    {attachedMessage}
                  </p>
                )}
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[11px] text-white/70">
                    {messageTiming}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-white/70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4 12l5 5L20 7" />
                    <path d="M9 12l5 5L20 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
