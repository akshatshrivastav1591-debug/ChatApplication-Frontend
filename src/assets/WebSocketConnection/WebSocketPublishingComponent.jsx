import {
  contextApiWebSocketCleint,
  contextStoringChatDetails,
  contextRefetchingChatDetails,
  contextCurrentUserID,
  contextRecentMessage,
  contextStoringIndexForChatDetail,
} from "../ContexApi/ContextApiStore";
import { useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchedGroupDetailsSliceActions } from "../Redux/FetchedGroupDetailsSlice";

export function WebSocketPublishingComponent() {
  const { client } = useContext(contextApiWebSocketCleint);
  const { chatDetails, setChatDetails } = useContext(contextStoringChatDetails);
  const { setFetchChatDetails } = useContext(contextRefetchingChatDetails);
  const { currentUserID } = useContext(contextCurrentUserID);
  const { setRecentMessage } = useContext(contextRecentMessage);
  const { chatIndex, setChatIndex } = useContext(
    contextStoringIndexForChatDetail,
  );
  const chatIndexRef=useRef(chatIndex);
  //-->redux
  const fetchedGroupChatDetails = useSelector(
    (state) => state.fetchedGroupChatDetails.fetchedGroupDetails,
  );
  const dispatch = useDispatch();
//updating the chatRef
useEffect(() => {
  chatIndexRef.current = chatIndex;
}, [chatIndex]);

  //--> Subscribing to single chat connection:
  useEffect(() => {
    if (!client || !client.connected || !chatDetails?.length) return;

    const subscriptions = chatDetails.map((SingleChatDetail) => {
      const roomId = SingleChatDetail.roomId;

      return client.subscribe(`/topic/chat/${roomId}`, (message) => {
        const data = JSON.parse(message.body);
        if (data === null||data.messageDto===null) {
          return;
        }
          
        const messages = Array.isArray(data.messageDto)
          ? data.messageDto
          : [data.messageDto]; // wrap single object into array

        const lastMsg = messages.at(-1);

        let contentofMessage;
        if (lastMsg.multipartRequest) {
          contentofMessage = lastMsg.fileType;
        } else {
          contentofMessage = lastMsg.messageContent;
        }

        const tempRoomId = data.roomId;
        const isNewContact = data.isNewContact;

        if (data !== null && isNewContact) {
          setFetchChatDetails(true);
          return;
        }
        if (data === null) {
          return;
        }
        if (data !== null && !isNewContact) {
          const messages = Array.isArray(data.messageDto)
            ? data.messageDto
            : [data.messageDto];
         let foundIndex = -1;

  setChatDetails((prevValues) => {
    const index = prevValues.findIndex(
      (details) => details.roomId === tempRoomId,
    );
    if (index === -1) return prevValues;
    foundIndex = index;

    const isOwnMessage = lastMsg.senderID === currentUserID;
    const isViewingThisChat = chatIndexRef.current === index;

    const updatedObj = {
      ...prevValues[index],
      lastMessage: contentofMessage,
      unseenMessagesCount:
        isOwnMessage || isViewingThisChat
          ? prevValues[index].unseenMessagesCount
          : lastMsg.unseenMessageCount,
    };

    const updatedValues = [...prevValues];
    updatedValues.splice(index, 1);
    updatedValues.unshift(updatedObj);
    return updatedValues;
  });
  if (foundIndex === -1) return;

  setRecentMessage({ roomId: tempRoomId, messages });

  setChatIndex((prevChatIndex) => {
    if (prevChatIndex === null) return prevChatIndex;
    if (prevChatIndex === foundIndex) return 0;
    if (prevChatIndex < foundIndex) return prevChatIndex + 1;
    return prevChatIndex;
  });

        } //
      });
    });

    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [client?.connected, chatDetails?.length]);
  // Connection to recieve data for  the  condition: User-1 send data to another user-2 and user-2 is active in this case,in this case user-1 had saved the  user-2 but user may not saved user-1 so is does not rercieve messsage on real time ,so fix this problem we have introduced this connection
  useEffect(() => {
    if (!client || !client.connected || !currentUserID) return;
      
    const personalSub = client.subscribe(
      `/topic/user/${currentUserID}`,
      (message) => {
        const data = JSON.parse(message.body);
        if(data.isNewContact ||data.isUserBlocked||data.isUserUnBlocked){
        setFetchChatDetails(true);
        }
      },
    );

    return () => personalSub.unsubscribe();
  }, [client?.connected, currentUserID]);
  //subscribing to the groupChat Connection
  useEffect(() => {
    if (!client || !client.connected || !fetchedGroupChatDetails?.length)
      return;

    const subscriptions = fetchedGroupChatDetails.map(
      (SingleGroupChatDetail) => {
        const groupId = SingleGroupChatDetail.groupId;

        return client.subscribe(`/topic/groupChat/${groupId}`, (message) => {
          const data = JSON.parse(message.body);

          if (data === null) {
            return;
          } else {
            
            const messageObject = Array.isArray(data.data)
              ? data.data
              : [data.data]; // wrap single object into array
            let recentMessageContentObject = {
              groupID: groupId,
              recentMessageContent: null,
              messageObjectLength: null,
              recentMessageid:null
            };
            const lastMessageObject = messageObject.at(-1);
            recentMessageContentObject.recentMessageContent =
              lastMessageObject.multipartRequestFlag
                ? lastMessageObject.fileType
                : lastMessageObject.messageContent;
            if (currentUserID === lastMessageObject.senderID)
              recentMessageContentObject.messageObjectLength = null;
            else
              recentMessageContentObject.messageObjectLength =
                messageObject.length;
                recentMessageContentObject.recentMessageid=lastMessageObject.messageID;
            dispatch(
              fetchedGroupDetailsSliceActions.updatingChatDetails(
                recentMessageContentObject,
              ),
            );

            dispatch(
              fetchedGroupDetailsSliceActions.updatingRecentMessage({
                groupID: groupId,
                messageObject: messageObject,
              }),
            );
          }
        });
      },
    );
    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, [client?.connected, fetchedGroupChatDetails?.length]);

  return null;
}
