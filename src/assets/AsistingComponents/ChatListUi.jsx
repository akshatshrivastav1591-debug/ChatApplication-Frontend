import { useEffect, useState } from "react";
import { ChatUi } from "../../ChatUI";
import { Loader } from "../../Loader";
import { ChatListUiAsistingComponent } from "./ChatListUiAsistingComponent";
import Logo from "../NOProfileImage.jpg";
import {
  contextStoringChatDetails,
  contextStoringIndexForChatDetail,
  contextRefetchingChatDetails,
  showingMultipartRequestUi,
  contextForSubscribingIsOnline,
} from "../ContexApi/ContextApiStore";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../Config/api";
export function ChatListUi() {
  const location = useLocation();
  const [Loading, setLoading] = useState(false);
  const [Errors, setErrors] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const { chatIndex, setChatIndex } = useContext(
    contextStoringIndexForChatDetail,
  );
  const { fetchChatDetails, setFetchChatDetails } = useContext(
    contextRefetchingChatDetails,
  );
  const { chatDetails, setChatDetails } = useContext(contextStoringChatDetails);
  const { setSubscribedToOnline } = useContext(contextForSubscribingIsOnline);
  const { showMultipartRequestUi, setShowMultipartRequestUi } = useContext(
    showingMultipartRequestUi,
  );
  function setIndex(index) {
    setSubscribedToOnline(true);
    if (showMultipartRequestUi) setShowMultipartRequestUi(false);
    setChatIndex(index);
  }
  useEffect(() => {
    async function FetchingChatDetails() {
      if (!fetchChatDetails) {
        return;
      }
      setLoading(true);

      try {
        const response = await fetch(
          `${API_BASE_URL}/getAllChatDetails`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        if (data.chatDetailsList.length === 0) {
          setIsEmpty(true);
          setErrors(null);
          setLoading(false);
          setFetchChatDetails(false);
          return;
        }
        if (response.ok) {
          setChatDetails(data.chatDetailsList);

          setErrors(null);
          setIsEmpty(false);
          if (location.state) {
            const { roomID } = location.state;
            const index = data.chatDetailsList.findIndex(
              (details) => details.roomId === roomID,
            );

            if (index !== -1) {
              setChatIndex(index);
            }
          }
          setLoading(false);
          setFetchChatDetails(false);
          return;
        } else {
          setErrors(data.message);
          setIsEmpty(false);
          setFetchChatDetails(false);
          setLoading(false);
        }
      } catch (error) {
        setErrors("Failed to load Chats,reason" + error);
        setFetchChatDetails(false);
        setLoading(false);
      }
      return () => {
        setSubscribedToOnline(false);
      };
    }
    FetchingChatDetails();
  }, [fetchChatDetails]);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div
          className={`w-full md:w-1/4 border overflow-y-auto ${
            chatIndex !== null ? "hidden md:block" : "block"
          }`}
        >
          {Loading ? (
            <Loader />
          ) : Errors !== null ? (
            <div className="font-extrabold text-red-500 px-3 py-2">{Errors}</div>
          ) : isEmpty ? (
            <div className="font-extrabold px-3 py-2">No Chats are Available</div>
          ) : (
            chatDetails?.map((SingleChatDetail, index) => (
              <div key={SingleChatDetail.roomId}>
                <ChatListUiAsistingComponent
                  ProfilePicture={SingleChatDetail.profilePicture}
                  SavedName={SingleChatDetail.savedName}
                  LastMessage={SingleChatDetail.lastMessage}
                  setIndexNO={() => {setIndex(index)
                        
                  }}
                  UnseenCount={
                   SingleChatDetail.unseenMessagesCount
                  }
                />
              </div>
            ))
          )}

          <div className="font-bold px-3 py-2">How it is going on life:</div>
        </div>
        <div
          className={`flex-1 ${
            chatIndex !== null ? "block" : "hidden md:block"
          }`}
        >
          <ChatUi
            profilePicture={
              chatIndex === null ? Logo : chatDetails[chatIndex]?.profilePicture
            }
            Name={
              chatIndex === null
                ? "Not Available:"
                : chatDetails[chatIndex]?.savedName
            }
            roomID={chatIndex === null ? -1 : chatDetails[chatIndex]?.roomId}
            userID={chatIndex === null ? -1 : chatDetails[chatIndex]?.userId}
            unseenMessageCount={
              chatIndex === null
                ? -1
                : chatDetails[chatIndex]?.unseenMessagesCount
            }
            updatingUnseenMessageCount0={() => {
              setChatDetails((prevdetails) => {
                const updatedValues = [...prevdetails];
                const updatedObject = {
                  ...updatedValues[chatIndex],
                  unseenMessagesCount: 0,
                };
                updatedValues[chatIndex] = updatedObject;
                return updatedValues;
              });
            }}
            blockedbyUserID={chatIndex === null ? null : chatDetails[chatIndex]?.blockedByUserID}
            isblocked={chatIndex === null ? false : chatDetails[chatIndex]?.blocked}
            onBack={() => setChatIndex(null)}
          />
        </div>
      </div>
    </>
  );
}