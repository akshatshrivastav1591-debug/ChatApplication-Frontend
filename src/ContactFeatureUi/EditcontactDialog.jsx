import { useState } from "react";
import { Buttons } from "../Buttons";
import { UpdateContactUi } from "./UpdateContactUi";
import { DeleteContactUI } from "./DeleteContactUi";
import { useLocation } from "react-router-dom";
export function EditContact() {
  const [UpdateUi, SetUpdateUi] = useState(false);
  const [DeleteUi, SetDeleteUi] = useState(false);
  const { state } = useLocation();
  function VisibleUpdateUi() {
    SetDeleteUi(false);
    SetUpdateUi(true);
  }
  function VisibleDeleteUi() {
    SetUpdateUi(false);
    SetDeleteUi(true);
  }
  function VisibilityFalse() {
    SetUpdateUi(false);
    SetDeleteUi(false);
  }
  return (
    <>
      <div className="bg-blue-100 px-4">
        <div className="flex justify-center">
          <label className="w-28 h-28 shrink-0 bg-blue-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
            <img
              src={state?.ContactInfo?.profilePhotoUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </label>
        </div>
        <div className="flex justify-center font-bold mt-1">
          <h1>{state?.ContactInfo?.savedName}</h1>
        </div>
        <div>
          {UpdateUi ? (
            <UpdateContactUi
              OnBack={VisibilityFalse}
              OldName={state?.ContactInfo?.savedName}
              oldContactNo={state?.ContactInfo?.savedUserContactNo}
            />
          ) : null}
        </div>
        <div>
          {DeleteUi ? (
            <DeleteContactUI
              OnBack={VisibilityFalse}
              oldName={state?.ContactInfo?.savedName}
              oldContactNo={state?.ContactInfo?.savedUserContactNo}
            />
          ) : null}
        </div>
        {UpdateUi || DeleteUi ? null : (
          <div className="justify-center flex flex-wrap gap-2 mt-2 pb-3">
            <Buttons OnChange={VisibleUpdateUi}>Edit Contact</Buttons>
            <Buttons OnChange={VisibleDeleteUi}>Delete Contact</Buttons>
          </div>
        )}
      </div>
    </>
  );
}