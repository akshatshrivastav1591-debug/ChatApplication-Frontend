export function DeleteMessageOptionUiForRecievedMessage({
  onDelete,
  closeTab,
  viewFile,
}) {
  return (
    <>
      <ul className="bg-blue-100 w-40 rounded-xl overflow-hidden divide-y divide-blue-200">
        {viewFile !== null ? (
          <li
            className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
            onClick={viewFile}
          >
            viewFile
          </li>
        ) : null}
        <li
          className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
          onClick={onDelete}
        >
          Delete Message
        </li>
        <li
          className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
          onClick={closeTab}
        >
          Close
        </li>
      </ul>
    </>
  );
}