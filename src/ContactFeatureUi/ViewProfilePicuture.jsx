import { useLocation, useNavigate } from "react-router-dom";

export function ViewProfilePicture() {
  const { state } = useLocation();
  const Navigate = useNavigate();
  function BackToContactList() {
    Navigate("/MainUI/ContactList");
  }
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-100 border-b border-blue-200">
        <button
          onClick={BackToContactList}
          className="text-blue-700 hover:bg-blue-200 p-1.5 rounded-full transition"
        >
          ←
        </button>
        <h2 className="text-blue-900 font-semibold text-base">
          Profile Picture
        </h2>
      </div>

      {/* Picture */}
      <div className="flex flex-col items-center justify-center flex-1 gap-4 px-6">
        <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img
            src={state?.ContactInfo?.profilePhotoUrl}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-blue-900">
            {state?.ContactInfo?.savedName}
          </h1>
          <p className="text-sm text-blue-400 mt-1">Profile Photo</p>
        </div>
      </div>
    </div>
  );
}
