import { DeleteMessageOptionUi } from "../../DeleteMessageOption";
export function SendedVideoComponent({
  attachedMessage,
  messageTiming,
  videoURl,
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
        <div className="flex flex-col w-full" onClick={onSelected}>
          <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[72%] self-end flex-row-reverse mt-2">
            <div className="bg-blue-500 rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl overflow-hidden">
              <div className="w-48 h-28 sm:w-60 sm:h-36 bg-[#1e3a5f] flex items-center justify-center relative">
                <video
                  src={videoURl}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 flex items-center justify-center z-10">
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
                {attachedMessage && (
                  <p className="text-sm text-white leading-snug mb-1 break-words">
                    {attachedMessage}
                  </p>
                )}
                <div className="flex items-center justify-end gap-1">
                  <span className="text-[11px] text-white/65">
                    {messageTiming}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-white/65"
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
