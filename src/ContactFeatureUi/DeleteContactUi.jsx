import { useState, useContext } from "react";
import { Loader } from "../Loader";
import { Buttons } from "../Buttons";
import { useNavigate } from "react-router-dom";
import {
  contextRefetchingChatDetails,
  contextRefetchingContactDetails,
} from "../assets/ContexApi/ContextApiStore";
import { API_BASE_URL } from "../Config/api";
export function DeleteContactUI({ OnBack, oldContactNo, oldName }) {
  //-->To fetch the updated contactDetails

  const { setFetchContactDetails } = useContext(
    contextRefetchingContactDetails,
  );
  const { setFetchChatDetails } = useContext(contextRefetchingChatDetails);
  //-->Sucesss message
  const [Sucess, SetSucess] = useState(false);
  //-->Loading state
  const [Loading, setLoading] = useState(false);
  //--Errors
  const [Errors, SetErrors] = useState(null);
  //->Navigation
  const Navigate = useNavigate();

  async function DeleteContact() {
    setLoading(true);
    const deleteContactNo = oldContactNo;
    const reponse = await fetch(`${API_BASE_URL}/deleteContact`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(deleteContactNo),
    });
    const data = await reponse.json();
    if (reponse.ok) {
      setFetchContactDetails(true);
      setFetchChatDetails(true);
      SetErrors(null);
      setLoading(false);
      SetSucess(true);
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
          <h1>Delete contact from here:</h1>{" "}
        </div>
        <div className="mt-3">
          <div className="flex flex-col sm:flex-row justify-center items-center font-bold gap-1">
            <span>Contact Number:</span>
            <input
              type="text"
              className="bg-blue-200 sm:ml-1 border-2 p-0.5 rounded-md w-full sm:w-auto max-w-xs"
              value={oldContactNo}
              disabled
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center font-bold mt-2.5 gap-1">
            <span>Contact Name:</span>
            <input
              type="text"
              className="bg-blue-200 border-2 p-0.5 rounded-md sm:ml-5 w-full sm:w-auto max-w-xs"
              value={oldName}
              disabled
            />
          </div>
          <div className="flex justify-center font-bold text-green-500  mt-2">
            {Sucess ? "Contact Deleted:" : null}
          </div>
          <div className="flex justify-center font-bold text-red-500">
            {!Errors == "" ? Errors : null}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {Loading ? (
              <Loader />
            ) : (
              <>
                <Buttons OnChange={DeleteContact}>Delete Contact</Buttons>
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