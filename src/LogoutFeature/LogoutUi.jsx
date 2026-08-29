import { useContext } from "react";
import { Buttons } from "../Buttons";
import {
  contextApiWebSocketCleint,
  contextStoringChatDetails,
  contextStoringContactDetails,
  contextRefetchingChatDetails,
  contextRefetchingContactDetails,
  contextCurrentUserID,
  contextRecentMessage,
  showingMultipartRequestUi,
  contextForSubscribingIsOnline,
  contextStoringIndexForChatDetail,
  contextForUnseenMEssageCount,
} from "../assets/ContexApi/ContextApiStore";
import { useDispatch } from "react-redux";
import { fetchedGroupDetailsSliceActions } from "../assets/Redux/FetchedGroupDetailsSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Config/api";

export function LogoutUi() {
  const { client, setClient, setIsAuthenticated } = useContext(
    contextApiWebSocketCleint,
  );
  const { setChatDetails } = useContext(contextStoringChatDetails);
  const { SetContactInfoList } = useContext(contextStoringContactDetails);
  const { setFetchChatDetails } = useContext(contextRefetchingChatDetails);
  const { setFetchContactDetails } = useContext(
    contextRefetchingContactDetails,
  );
  const { setCurrentUserID } = useContext(contextCurrentUserID);
  const { setRecentMessage } = useContext(contextRecentMessage);
  const { setShowMultipartRequestUi } = useContext(showingMultipartRequestUi);
  const { setSubscribedToOnline } = useContext(contextForSubscribingIsOnline);
  const { setChatIndex } = useContext(contextStoringIndexForChatDetail);
  const { setUnseenCount } = useContext(contextForUnseenMEssageCount);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function logoutFunction() {
    try {
      const response = await fetch(`${API_BASE_URL}/userLogout`, {
        credentials: "include",
        method: "POST",
      });
      if (response.ok) {
        client.deactivate();
        setIsAuthenticated(false);
        setClient(null);
        setChatDetails([]);
        SetContactInfoList([]);
        setFetchChatDetails(true);
        setFetchContactDetails(true);
        setCurrentUserID(null);
        setRecentMessage(null);
        setShowMultipartRequestUi(false);
        setSubscribedToOnline(false);
        setChatIndex(null);
        setUnseenCount(0);
        dispatch(fetchedGroupDetailsSliceActions.logout());
        navigate("/Login");
      } else {
        throw new Error("Something Wrong with backend:");
      }
    } catch (error) {
      console.log("Something went  wrong:");
    }
  }
  function cancellingLogout() {
    navigate("/MainUI/ChatList");
  }
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Log out?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            You'll need to sign in again to access your chats.
          </p>
          <div className="flex gap-x-3">
            <Buttons
              className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg py-2 font-medium transition"
              OnChange={cancellingLogout}
            >
              Cancel
            </Buttons>
            <Buttons
              className="flex-1 bg-red-500 text-white hover:bg-red-600 rounded-lg py-2 font-medium transition"
              OnChange={logoutFunction}
            >
              Log out
            </Buttons>
          </div>
        </div>
      </div>
    </>
  );
}
