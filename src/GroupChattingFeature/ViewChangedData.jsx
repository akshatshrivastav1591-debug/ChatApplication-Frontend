export function ShowEditedData({
  editedData,
  ReEditFunction,
  Topic,
  Logo,
  showReditFunction,
  currentUseOfTheComponent,
}) {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <label className="font-bold">{Topic}</label>
        {showReditFunction ? (
          <label
            className="font-bold text-blue-500 active:text-blue-700 sm:hover:text-blue-600 cursor-pointer"
            onClick={ReEditFunction}
          >
            {"Edit Data"}
          </label>
        ) : null}
      </div>
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border-2 rounded p-2 bg-green-50 mt-2">
        {editedData.length > 0 ? (
          editedData.map((member) => (
            <div
              key={
                currentUseOfTheComponent === "New Member"
                  ? member.contactId
                  : member.userID
              }
              className="flex items-center justify-between gap-3 p-1 rounded active:bg-green-200 sm:hover:bg-green-100"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={
                    (currentUseOfTheComponent === "New Member"
                      ? member.profilePicture
                      : member.userProfilePicture) || Logo
                  }
                  alt="contact"
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="truncate">
                    {currentUseOfTheComponent === "New Member"
                      ? member.savedName
                      : member.contactSavedName}
                  </span>
                  <span className="text-xs font-normal text-green-700">
                    Added
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="font-normal text-gray-500">No members added yet</div>
        )}
      </div>
    </div>
  );
}