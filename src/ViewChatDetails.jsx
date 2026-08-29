import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/NOProfileImage.jpg";
import { Buttons } from "./Buttons";
import {
  contextStoringChatDetails,
  contextStoringIndexForChatDetail,
  contextRefetchingChatDetails,
  contextCurrentUserID
} from "./assets/ContexApi/ContextApiStore";
import { ConfirmationModal } from "./GroupChattingFeature/ConfirmationModel";
import { API_BASE_URL } from "./Config/api";
export function ViewChatFeature() {
  const [error, setError] = useState("");
  const [message,SetMessage]=useState("");
  const [errorImage, setErrorImage] = useState(false);
  const [buttonText,setButtonText]=useState("Temporary Block")
  const [action, setAction] = useState("");
  const [showConFirmationModel, setShowConFirmationModel] = useState(false);
  const { chatIndex } = useContext(contextStoringIndexForChatDetail);
  const { setFetchChatDetails } = useContext(contextRefetchingChatDetails);
  const { currentUserID } = useContext(contextCurrentUserID);
  const { chatDetails } = useContext(contextStoringChatDetails);
  
  const navigate = useNavigate();
  //function to setErrorImage back to false
  useEffect(() => {
    async function resettingErrorImage() {
      setErrorImage(false);
    }
    resettingErrorImage();
  }, []);

  function navigateToChatDetail() {
    navigate("/MainUI/ChatList");
  }
  //function to handle temporary blocking
  async function handleTempBlocking() {
    
    try {
      const response = await fetch(`${API_BASE_URL}/BlockUser`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        method: "PUT",
        body: JSON.stringify(chatDetails[chatIndex]),
      });
      const data =await response.json();
      if (response.ok && data.success) {
        setFetchChatDetails(true);
        setShowConFirmationModel(false);
        navigateToChatDetail();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
  }
//function to setTheText of button
useEffect(()=>{
async function settingButton(){
 if(chatDetails[chatIndex].blocked&&chatDetails[chatIndex].blockedByUserID===currentUserID) setButtonText("UnBlock User");

 }
settingButton();
},[])

  //function to handle unblock
 async function handleUnblock(){
    try {
      const roomID=chatDetails[chatIndex].roomId;
      const response = await fetch(`${API_BASE_URL}/UnBlockUser/${roomID}`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        method: "PUT",
        body: JSON.stringify(chatDetails[chatIndex]),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setFetchChatDetails(true);
        setShowConFirmationModel(false);
        navigateToChatDetail();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
    }
 }

  
  return (
    <>
      <div className="bg-blue-100 font-bold flex flex-col items-center py-10 gap-6 max-h-[85vh] overflow-y-auto">
        {showConFirmationModel ? (
          <ConfirmationModal
            onCancel={() => {
              setShowConFirmationModel(false);
            }}
            message={message}
            onConfirm={() => {
              if (action === "temp") handleTempBlocking();
             
              if(action==="unBlock") handleUnblock(); 
            }}
            title="Confirm your request"
            isOpen={showConFirmationModel}
            confirmText="Are you sure?:"
          />
        ) : (
          <div className="flex flex-col items-center gap-6 w-full px-4">
            {/* Title */}
            <h1 className="text-center text-lg">Chat Info</h1>

            <label className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden shrink-0">
              <img
                src={
                  !chatDetails[chatIndex] || errorImage
                    ? Logo
                    : chatDetails[chatIndex].profilePicture
                }
                onError={() => {
                  setErrorImage(true);
                }}
                alt="Image Not found:"
                className="w-full h-full object-cover"
              />
              <input type="file" className="hidden" disabled={true} />
            </label>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              {/* Row 1 */}
              <div className="flex gap-4">
                <div className="flex flex-col w-full">
                  <input
                    className="bg-blue-200 p-2 rounded border-2 text-center"
                    value={
                      chatDetails[chatIndex]
                        ? chatDetails[chatIndex].savedName
                        : "Name_Not_Available"
                    }
                  />
                </div>
              </div>
            </div>

            {error ? (
              <div className="flex justify-center font-bold text-red-500">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Buttons
                OnChange={() => {
                    if(buttonText==="Temporary Block"){
                      SetMessage("This user will be fully blocked, just like a permanent block — they can't message you, see your profile, or contact you in any way. It stays in place until you choose to unblock them yourself; it won't lift on its own.");
                  setAction("temp");
                    }
                    if(buttonText==="UnBlock User"){
                        SetMessage("This user will be unblocked and can message you, see your profile, and contact you again. Any existing chat history between you will remain as is — nothing will be restored or deleted as part of this action.")
                        setAction("unBlock")
                    }
                  setShowConFirmationModel(true);
                }}
              >
               {buttonText}
              </Buttons>
              
              <Buttons OnChange={navigateToChatDetail}>Back</Buttons>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
