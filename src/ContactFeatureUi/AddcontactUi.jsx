import { useRef, useState,useContext } from "react";
import { Buttons } from "../Buttons";
import { Loader } from "../Loader";
import {contextRefetchingChatDetails,contextRefetchingContactDetails} from "../assets/ContexApi/ContextApiStore";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Config/api";

export function AddContactsUi() {

  //to fetch the updated contactDetails
 
  const {setFetchContactDetails}=useContext(contextRefetchingContactDetails)
  const {setFetchChatDetails}=useContext(contextRefetchingChatDetails)
  //Contact details
  const contactNumber = useRef();
  const contactName = useRef();
   //Navigation
   const navigate=useNavigate();
  //Loader
  const [Loading, SetLoading] = useState(false);
  //Error
  const [Error, setError] = useState("");
  //Sucess
  const [Sucess, setSucess] = useState(false);
  async function AddContact() {
    SetLoading(true);
    const userContacts = {
      contactNumber: contactNumber.current.value,
      savedName: contactName.current.value,
    };
    const response = await fetch(`${API_BASE_URL}/addNewContact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userContacts),
    });
    const data = await response.json();
    if (response.ok) {
      setFetchContactDetails(true);
      setFetchChatDetails(true);
      SetLoading(false);
      setError("");
      setSucess(true);
      navigate("/MainUI/ContactList");
    } else {
      setSucess(false);
      SetLoading(false);
      setError(data.message);
    }
  }
  return (
    <>
      <div className="bg-blue-100 px-4">
        <div className="flex justify-center font-extrabold text-xl">
          <h1>Add contact from here:</h1>{" "}
        </div>
        <div className="mt-3">
          <div className="flex flex-col sm:flex-row justify-center items-center font-bold gap-1">
            <span>Enter Contact Number:</span>
            <input
              type="text"
              className="bg-blue-200 sm:ml-1 border-2 p-0.5 rounded-md w-full sm:w-auto max-w-xs"
              ref={contactNumber}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center font-bold mt-2.5 gap-1">
            <span>Enter Contact Name:</span>
            <input
              type="text"
              className="bg-blue-200 border-2 p-0.5 rounded-md sm:ml-5 w-full sm:w-auto max-w-xs"
              ref={contactName}
            />
          </div>
          <div className="flex justify-center font-bold text-green-500  mt-2">
            {Sucess ? "Contact Added:" : null}
          </div>
          <div className="flex justify-center font-bold text-red-500">
            {!Error == "" ? Error : null}
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {Loading ? (
              <Loader />
            ) : (
              <>
                <Buttons OnChange={AddContact}>Add Contact</Buttons>
              </>
            )}
          </div>
        </div>
        <div className="pb-4" />
      </div>
    </>
  );
}