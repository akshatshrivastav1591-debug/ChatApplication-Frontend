import { useRef, useState, useContext } from "react";
import { Loader } from "../Loader";
import { Buttons } from "../Buttons";
import { useNavigate } from "react-router-dom";
import {
  contextRefetchingChatDetails,
  contextRefetchingContactDetails,
} from "../assets/ContexApi/ContextApiStore";
import { API_BASE_URL } from "../Config/api";
//oldContactNumber,updatedContactNumber,updatedSavedName
export function UpdateContactUi({ OnBack, OldName, oldContactNo }) {
  const newContactNumber = useRef();
  const newContactName = useRef();
  //To fetch the updated contactDetails
  const { setFetchContactDetails } = useContext(
    contextRefetchingContactDetails,
  );
  const { setFetchChatDetails } = useContext(contextRefetchingChatDetails);
  //-->Sucesss message
  //->Navigation to contact list page:
  const Navigate = useNavigate();
  //-->Success Message
  const [Success, SetSuccess] = useState(null);
  //->Loading Screen
  const [Loading, setLoading] = useState(false);
  //->Errors
  const [Errors, SetErrors] = useState(null);
  async function UpdateContact() {
    setLoading(true);
    const updatedUserDetails = {
      oldContactNumber: oldContactNo,
      updatedContactNumber: newContactNumber.current.value,
      updatedSavedName: newContactName.current.value,
    };
    const response = await fetch(`${API_BASE_URL}/updateContact`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(updatedUserDetails),
    });
    const data = await response.json();
    if (response.ok) {
      setFetchContactDetails(true);
      setFetchChatDetails(true);
      setLoading(false);
      SetErrors(null);
      SetSuccess("Contact Successfully Updated:");
      setTimeout(() => {
        Navigate("/MainUI/ContactList");
      }, 1000);
    } else {
      setLoading(false);
      SetErrors(data.message);
    }
  }
  return (
    <>
      <div className="bg-blue-100 px-4">
        <div className="flex justify-center font-extrabold text-xl">
          <h1>Update contact from here:</h1>{" "}
        </div>
        <div className="mt-3">
          <div className="flex flex-col sm:flex-row justify-center items-center font-bold gap-1">
            <span>Enter New Contact Number:</span>
            <input
              type="text"
              className="bg-blue-200 sm:ml-1 border-2 p-0.5 rounded-md w-full sm:w-auto max-w-xs"
              ref={newContactNumber}
              defaultValue={oldContactNo}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center font-bold mt-2.5 gap-1">
            <span>Enter New Contact Name:</span>
            <input
              type="text"
              className="bg-blue-200 border-2 p-0.5 rounded-md sm:ml-5 w-full sm:w-auto max-w-xs"
              ref={newContactName}
              defaultValue={OldName}
            />
          </div>
          <div className=" flex justify-center font-bold text-green-500">
            {Success != null ? Success : null}
          </div>
          <div className="flex justify-center font-bold text-red-500">
            {Errors !== null ? Errors : null}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {Loading ? (
              <Loader />
            ) : (
              <>
                <Buttons OnChange={UpdateContact}>Update Contact</Buttons>
                <Buttons OnChange={OnBack}>Back</Buttons>
              </>
            )}
          </div>
        </div>
        <div className="pb-4" />
      </div>
    </>
  );
}