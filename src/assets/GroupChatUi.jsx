import { MoreVertical, ArrowLeft } from "lucide-react";
import {
  useRef,
  useState,
  useContext,
  useEffect,
  useLayoutEffect,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchedGroupDetailsSliceActions } from "./Redux/FetchedGroupDetailsSlice";
import { MultiPartRequestComponent } from "./MultiPartRequestComponent";
import { Loader } from "../Loader";
import { PaperclipIcon } from "lucide-react";
import { ArrowUpIcon } from "lucide-react";
import { DateFeedFunction } from "./AsistingComponents/ChatLIstAssistingComponents/DateFeedAsistsing";
import { SendedMessageField } from "./AsistingComponents/ChatLIstAssistingComponents/SendedMessaageFeed";
import { SendedImageComponent } from "./AsistingComponents/ChatLIstAssistingComponents/SendedImage";
import { ViewFilesComponent } from "./ViewFileComponent";
import { SendedVideoComponent } from "./AsistingComponents/ChatLIstAssistingComponents/SendedVidoes";
import { RecentMessageStyle } from "./RecentMessaeStyle";
import { OnClickOptionForUsers } from "../GroupChattingFeature/onClickedOptionsForUser";
import {
  contextApiWebSocketCleint,
  contextCurrentUserID,
} from "./ContexApi/ContextApiStore";
import { ViewGroupInfo } from "../GroupChattingFeature/ViewGroupInfo";
import { EditGroupInfo } from "../GroupChattingFeature/EditGroupInfo";
import { FileSizeConverter } from "./FileSizeConverter";
import { CompressingFiles } from "./CompressingFiles";
import { ReceivedGroupMessages } from "../GroupChattingFeature/GroupMessageFields/RecievedGroupMessageFeild";
import { ReceivedGroupImages } from "../GroupChattingFeature/GroupMessageFields/RecievedGroupImagesComponent";
import { ReceivedGroupVideos } from "../GroupChattingFeature/GroupMessageFields/RecivedGroupVideoComponent";
import { InitializeSounds } from "./SoundsComponent/SoundsComponeent";
import { SendingMessageSound } from "./SoundsComponent/SoundsComponeent";
import { ReceivingMessageSound } from "./SoundsComponent/SoundsComponeent";
import Logo from "./NOProfileImage.jpg";
import { API_BASE_URL } from "../Config/api";
export function GroupChatUI({
  groupIcon,
  groupName,
  isAdmin,
  groupID,
  userLogo,
  lastCheckedMessageId,
  unseenMessageCount,
  settingUnseenMessageCount0,
  listOfContactsInGroup,
  onBack,
}) {
  //--> States:
  const [showMultipartRequestUi, setShowMultipartRequestUi] = useState(false);
  const [sendingFile, setSendingFile] = useState([]);
  const [objectUrls, setObjectUrls] = useState([]);
  const [error, setError] = useState(false);
  const [showFile, setShowFile] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [unseenMessageIndex, setUnseenMessageIndex] = useState(-1);
  const [localUnseenMessageCount, setLocalUnseenMessageCount] = useState(0);
  const [scrollTarget, setScrollTarget] = useState("bottom");
  const [scroll, setScroll] = useState(true);
  const [viewFeatures, setViewFeatures] = useState(false);
  const [
    loadingIndicatorForMultipartRequest,
    setLoadingIndicatorForMultipartRequest,
  ] = useState(false);
  const [deletingMessageIndex, setDeletingMessageIndex] = useState(-1);
  const [errorImage, setErrorImage] = useState(false);
  //-->refs
  const demoMessage = useRef();
  const scrollContainerRef = useRef();
  const bottomView = useRef();
  const unseenDivideRef = useRef();
  const cursorRef = useRef({ data: null, time: null });
  const pendingScrollAdjustRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const isFetchingRef = useRef(false);
  //redux
  const recentMessage = useSelector(
    (state) => state.fetchedGroupChatDetails.recentMessageObject,
  );

  const dispatch = useDispatch();
  //cotext api
  const { client } = useContext(contextApiWebSocketCleint);
  const { currentUserID } = useContext(contextCurrentUserID);
  //view GroupIndex
  function viewMoreOptions() {
    setViewFeatures((prevValues) => {
      const updatedValue = !prevValues;
      return updatedValue;
    });
  }
  //-> Handle Sending Message function
  function HandleSendingMessage() {
    if (demoMessage.current.value === null || demoMessage.current.value === "")
      return;
    setUnseenMessageIndex(-1);
    if (!client || !client.connected) {
      return;
    }
    client.publish({
      destination: `/app/groupChat/${groupID}`,
      body: JSON.stringify({
        content: demoMessage.current.value,
      }),
    });
    demoMessage.current.value = "";
  }
  // Show Multipart request function
  function MultipartRequestFunction(e) {
    if (showMultipartRequestUi) {
      setShowMultipartRequestUi(false);
      
      return;
    }
    const file = Array.from(e.target.files);
   
    if (file.length > 0) {
      
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      const urls = file.map((f) => URL.createObjectURL(f));
      setObjectUrls(urls);
      setSendingFile(file);
      setShowMultipartRequestUi(true);
    }
  }
  //function to set the errorImage=false
  useEffect(() => {
    async function settingErrorImageToFalse() {
      setErrorImage(false);
    }
    settingErrorImageToFalse();
  }, [groupID]);
  //Function to handle the sending of multipart-File function
  async function SendingMultiPartRequestFunction(files, attachedMessages) {
    setLoadingIndicatorForMultipartRequest(true);
    try {
      const compressedFiles = await Promise.all(
        files.map((file) => CompressingFiles(file, 0.7)),
      );

      const filesAndAttachedMessagesObjectArray = await Promise.all(
        files.map(async (file, index) => {
          //For Sending Images:
          if (file.type.startsWith("image/")) {
            const sendingFile = new FormData();
            sendingFile.append("file", compressedFiles[index]);
            sendingFile.append("upload_preset", "GroupSendedImages");
            sendingFile.append("cloud_name", "dm2a2akgj");
            sendingFile.append("folder", "SendedGroupImages");
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/dm2a2akgj/auto/upload`,
              {
                method: "POST",
                body: sendingFile,
              },
            );
            const data = await response.json();
            if (response.ok) {
              return {
                fileUrl: data.secure_url,
                attachedMessage: attachedMessages[index] ?? "",
                filePublicId: data.public_id,
                fileType: data.resource_type,
                fileName: `${data.original_filename}.${data.format}`,
                fileSize: FileSizeConverter(data.bytes),
              };
            }
          }

          //For Sending Videos
          if (file.type.startsWith("video/")) {
            const sendingFile = new FormData();
            sendingFile.append("file", compressedFiles[index]);
            sendingFile.append("upload_preset", "GroupSendedVideos");
            sendingFile.append("cloud_name", "dm2a2akgj");
            sendingFile.append("folder", "GroupSendedVideos");
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/dm2a2akgj/auto/upload`,
              {
                method: "POST",
                body: sendingFile,
              },
            );
            const data = await response.json();
            if (response.ok) {
              return {
                fileUrl: data.secure_url,
                attachedMessage: attachedMessages[index] ?? "",
                filePublicId: data.public_id,
                fileType: data.resource_type,
                fileName: `${data.original_filename}.${data.format}`,
                fileSize: FileSizeConverter(data.bytes),
              };
            }
          }
        }),
      );

      if (!client || !client.connected) {
        return;
      }
      client.publish({
        destination: `/app/multiPartRequestForGroupMessaging/${groupID}`,
        body: JSON.stringify(
          filesAndAttachedMessagesObjectArray.filter(Boolean),
        ),
      });
      setLoadingIndicatorForMultipartRequest(false);
      setShowMultipartRequestUi(false);
    } catch (error) {
      setError(true);
    }
  }
  //function to handle the deletion of Messages
  async function handleDeleteMessage(deletionFlag, deletionMessageObject) {
    try {
      setDeletingMessageIndex(-1);
      const response = await fetch(
        `${API_BASE_URL}/deleteGroupMessage/${deletionFlag}`,
        {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(deletionMessageObject),
          credentials: "include",
          method: "DELETE",
        },
      );
      const data = await response.json;
      if (response.ok) {
        if (!deletionFlag) {
          setFetchedMessages((prevDetails) => {
            const updatedArray = [...prevDetails];
            const deletionIndex = updatedArray.findIndex(
              (element) =>
                element.messageID === deletionMessageObject.messageID,
            );
            if (deletionIndex === -1)
              throw new Error("Something went wrong,Deletion index is -1");
            updatedArray.splice(deletionIndex, 1);
            return updatedArray;
          });

          setScroll(false);
        }
      } else {
        throw new Error(
          "Something went wrong,with backend,Reason:",
          data.message,
        );
      }
    } catch (error) {
      setError(true);
    }
  }
  //function to fetch messages
  useEffect(() => {
    let ignore = false;
    async function fetchingMessages() {
      if (groupID === null) return;
      setLoading(true);
      setError(false);
      setIsEmpty(false);
      setUnseenMessageIndex(-1);
      setScrollTarget("bottom");
      setLocalUnseenMessageCount(0);
      try {
        const response = await fetch(
          `${API_BASE_URL}/getGroupMessages/${groupID}`,
          {
            credentials: "include",
            method: "GET",
          },
        );
        const fetchedData = await response.json();
        if (response.ok) {
          if (fetchedData.data === null) setIsEmpty(true);
          else {
            if (
              listOfContactsInGroup === 0 ||
              listOfContactsInGroup.length === 0
            ) {
              setFetchedMessages(fetchedData.data);
            } else {
              setFetchedMessages(() => {
                const tempFetchedMessage = fetchedData.data;
                tempFetchedMessage.map((message) => {
                  const contactIndex = listOfContactsInGroup.findIndex(
                    (contact) => contact.savedUserID === message.senderID,
                  );
                  if (contactIndex !== -1)
                    message.senderName =
                      listOfContactsInGroup[contactIndex].savedName;
                });
                return tempFetchedMessage;
              });
            }

            if (unseenMessageCount > 0) {
              const lastCheckedMessageIndex = fetchedData.data.findIndex(
                (singleMessage) =>
                  singleMessage.messageID === lastCheckedMessageId,
              );
              if (lastCheckedMessageIndex === -1) return;
              setUnseenMessageIndex(lastCheckedMessageIndex + 1);
              setLocalUnseenMessageCount(unseenMessageCount);
              setScrollTarget("divider");
              dispatch(
                fetchedGroupDetailsSliceActions.updatingLastCheckedMessageInGroupInfo(
                  {
                    groupId: groupID,
                    messageObject: fetchedData.data.at(-1),
                  },
                ),
              );
            }
            if (fetchedData.data.length > 0) {
              setScroll(true);
              cursorRef.current = {
                date: fetchedData.data[0].sendingDate,
                time: fetchedData.data[0].sendingTime,
              };
            }
            settingUnseenMessageCount0();
          }
        } else throw new Error(fetchedData.message);
      } catch (error) {
        if (!ignore) {
          setError(true);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchingMessages();
    return () => {
      ignore = true;
    };
  }, [groupID]);

  useLayoutEffect(() => {
    if (!pendingScrollAdjustRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const newScrollHeight = container.scrollHeight;
    const heightDifference = newScrollHeight - prevScrollHeightRef.current;
    container.scrollTop += heightDifference; // push scroll position down by exactly how much content grew above it

    pendingScrollAdjustRef.current = false;
  }, [fetchedMessages]);

  function handleScroll() {
    if (isFetchingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 300) {
      // user is near the top → fetch older messages

      isFetchingRef.current = true;
      fetchingRemainingMessages();
    }
  }
  //Initial Values of isFetching and cursorRef
  useEffect(() => {
    cursorRef.current = {
      date: null,
      time: null,
    };
    isFetchingRef.current = false;
  }, [groupID]);
  //Function to fetch remaining messages
  async function fetchingRemainingMessages() {
    try {
      setScroll(false);
      if (scrollContainerRef.current) {
        prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
      }

      const { date: lastMessageSendingDate, time: lastMessageSendingTime } =
        cursorRef.current;
      const response = await fetch(
        `${API_BASE_URL}/getRemainingGroupMessage/${groupID}/${lastMessageSendingDate}/${lastMessageSendingTime}`,
        {
          credentials: "include",
          method: "GET",
        },
      );
      if (response.status === 204) {
        isFetchingRef.current = false;
        return;
      }
      if (response.status === 500) {
        isFetchingRef.current = false;
        return;
      }
      const fetchedData = await response.json();
      if (fetchedData.data.length > 0) {
        cursorRef.current = {
          date: fetchedData.data[0].sendingDate,
          time: fetchedData.data[0].sendingTime,
        }; // update cursor immediately, synchronously
      }
      pendingScrollAdjustRef.current = true;
      setFetchedMessages((prev) => [...fetchedData.data, ...prev]);
      isFetchingRef.current = false;
    } catch (error) {
      isFetchingRef.current = false;
    }
  }
  //Usage of Scroll
  useEffect(() => {
    if (!scroll) return;
    if (scrollTarget === "bottom") {
      bottomView.current?.scrollIntoView({
        behavior: "instant",
      });
    } else {
      unseenDivideRef.current?.scrollIntoView({
        behavior: "instant",
      });
    }
  }, [fetchedMessages, groupID, showMultipartRequestUi,showFile]);

  //Function to show the photos and videos
  function ViewFiles(viewIndex) {
    if (showFile.length === 0) {
      const viewFile = fetchedMessages[viewIndex];
      const otherFiles = fetchedMessages.filter(
        (file) =>
          file.multipartRequestFlag &&
          file.sendingDate === viewFile.sendingDate &&
          file.messageID !== viewFile.messageID,
      );

      const viewingFiles = [viewFile, ...otherFiles];

      setShowFile(viewingFiles);
    } else {
      setShowFile([]);
      setScrollTarget("bottom");
       setScroll(true);
    }
  }
  //updating Recent Messages
  useEffect(() => {
    async function UpdatingRecentMessages() {
      if (recentMessage.messageObject === null) return;
      if (recentMessage.groupID !== groupID) {
        dispatch(fetchedGroupDetailsSliceActions.resettingRecentMessage());
        return;
      }

      setFetchedMessages((prev) => {
        if (!listOfContactsInGroup || listOfContactsInGroup.length === 0) {
          return [...prev, ...recentMessage.messageObject];
        } else {
          const recentMessageObject = recentMessage.messageObject.map(
            (message) => {
              const indexOFName = listOfContactsInGroup.findIndex(
                (contact) => contact.savedUserID === message.senderID,
              );
              if (indexOFName !== -1) {
                return {
                  ...message,
                  senderName: listOfContactsInGroup[indexOFName].savedName,
                };
              }
              return message;
            },
          );
          return [...prev, ...recentMessageObject];
        }
      });
      setIsEmpty(false);
      setScroll(true);
      recentMessage.messageObject.forEach((message) => {
        if (message.senderID === currentUserID) {
          SendingMessageSound();
        } else ReceivingMessageSound();
      });

      dispatch(fetchedGroupDetailsSliceActions.resettingRecentMessage());
    }
    UpdatingRecentMessages();
  }, [recentMessage]);
  //Initializing sounds
  useEffect(() => {
    InitializeSounds();
  }, []);
  //subscribing to group online method
  useEffect(() => {
    try {
      if (!client || !client.connected) return;
      const subscription = client.subscribe(
        `/topic/subscribingGroupChatOnline/${groupID}`,
        (message) => {
          const response = JSON.parse(message.body);

          const deletedMessageObject = response.data;
          setFetchedMessages((preDetails) => {
            const updatedValues = [...preDetails];
            const deletionIndex = updatedValues.findIndex(
              (element) => element.messageID === deletedMessageObject.messageID,
            );
            if (deletionIndex === -1)
              throw new Error("Something went wrong the deletion index=-1");
            updatedValues.splice(deletionIndex, 1);

            setScroll(false);
            return updatedValues;
          });
        },
      );
      return () => {
        subscription.unsubscribe();
        setUnseenMessageIndex(-1);
      };
    } catch (error) {
      console.log("error");
    }
  }, [client, groupID]);
  return (
    <>
      {showGroupInfo ? (
        <>
          {isAdmin ? (
            <EditGroupInfo
              closingFunction={() => setShowGroupInfo(false)}
              groupLogo={groupIcon}
              groupName={groupName}
              isCurrentUserAdmin={isAdmin}
              groupID={groupID}
            />
          ) : (
            <ViewGroupInfo
              closingFunction={() => setShowGroupInfo(false)}
              groupLogo={groupIcon}
              groupName={groupName}
              groupID={groupID}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col h-full bg-blue-300">
          {/* Header — fixed height */}
          <header className="flex items-center justify-between gap-2 border p-2 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="md:hidden flex items-center justify-center w-8 h-8 shrink-0"
                aria-label="Back to group list"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden">
                <img
                  src={!groupIcon || errorImage ? Logo : groupIcon}
                  alt="profile"
                  className="w-full h-full object-cover"
                  onError={() => {
                    setErrorImage(true);
                  }}
                />
              </div>
              <span className="font-bold text-sm">{groupName}</span>
            </div>
            {viewFeatures ? (
              <OnClickOptionForUsers
                closingFunction={viewMoreOptions}
                viewOptions={viewFeatures}
                isAdmin={isAdmin}
                groupID={groupID}
                setViewFeature={() => setViewFeatures(false)}
                setShowGroupInfoFunction={() => setShowGroupInfo(true)}
              />
            ) : (
              <MoreVertical onClick={viewMoreOptions} />
            )}
          </header>

          {/* Messages — grows to fill remaining space */}
          {}
          {showMultipartRequestUi ? (
            <div className=" bg-white gap-1 ">
              {showMultipartRequestUi ? (
                <MultiPartRequestComponent
                  files={sendingFile}
                  objectUrls={objectUrls}
                  sendingFiles={SendingMultiPartRequestFunction}
                  ShowMultiPartUi={MultipartRequestFunction}
                  loadingIndicator={loadingIndicatorForMultipartRequest}
                />
              ) : null}
            </div>
          ) : (
            <>
              {showFile.length === 0 ? (
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-4 flex flex-col"
                >
                  {Loading ? (
                    <Loader />
                  ) : (
                    <div>
                      {error ? (
                        <div className=" flex justify-center">
                          <div className="w-50 flex justify-center bg-red-400 font-bold p-2">
                            Something Went Wrong
                          </div>
                        </div>
                      ) : isEmpty ? (
                        <div className=" flex justify-center">
                          <div className="w-50 flex justify-center bg-red-400 font-bold p-2">
                            No Messages:
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {fetchedMessages.map((message, index) => (
                            <div key={index} className="flex flex-col w-full">
                              {index === 0 ? (
                                <DateFeedFunction
                                  SendingDate={message.sendingDate}
                                />
                              ) : message.sendingDate ===
                                fetchedMessages[index - 1]
                                  .sendingDate ? null : (
                                <DateFeedFunction
                                  SendingDate={message.sendingDate}
                                />
                              )}
                              {unseenMessageIndex !== -1 &&
                              unseenMessageIndex === index ? (
                                <div ref={unseenDivideRef}>
                                  <RecentMessageStyle
                                    unreadCount={localUnseenMessageCount}
                                  />
                                </div>
                              ) : null}
                              {!message.multipartRequestFlag &&
                              message.senderID === currentUserID ? (
                                <SendedMessageField
                                  messageTiming={message.sendingTime}
                                  sendedMessageContent={message.messageContent}
                                  index={index}
                                  onSelected={() => {
                                    if (deletingMessageIndex === -1)
                                      setDeletingMessageIndex(index);
                                    else setDeletingMessageIndex(-1);
                                  }}
                                  selectedIndex={deletingMessageIndex}
                                  deleteMessage={() =>
                                    handleDeleteMessage(false, message)
                                  }
                                  deleteForAll={() =>
                                    handleDeleteMessage(true, message)
                                  }
                                />
                              ) : (
                                <>
                                  {!message.multipartRequestFlag ? (
                                    <ReceivedGroupMessages
                                      index={index}
                                      receivedMessagesContent={
                                        message.messageContent
                                      }
                                      messagesTiming={message.sendingTime}
                                      senderName={message.senderName}
                                      senderPicture={
                                        message.senderProfilePicture
                                      }
                                      selectedIndex={deletingMessageIndex}
                                      onSelected={() => {
                                        if (deletingMessageIndex === -1)
                                          setDeletingMessageIndex(index);
                                        else setDeletingMessageIndex(-1);
                                      }}
                                      deletedMessage={() =>
                                        handleDeleteMessage(false, message)
                                      }
                                      Logo={userLogo}
                                    />
                                  ) : null}{" "}
                                </>
                              )}
                              {message.multipartRequestFlag &&
                              message.fileType === "image" ? (
                                <div>
                                  {message.senderID === currentUserID ? (
                                    <SendedImageComponent
                                      attachedMessage={message.messageContent}
                                      messageTiming={message.sendingTime}
                                      sendedImageUrl={message.fileUrl}
                                      viewFile={() => {
                                        ViewFiles(index);
                                        setDeletingMessageIndex(-1);
                                      }}
                                      index={index}
                                      selectedIndex={deletingMessageIndex}
                                      onSelected={() => {
                                        if (deletingMessageIndex === -1)
                                          setDeletingMessageIndex(index);
                                        else setDeletingMessageIndex(-1);
                                      }}
                                      deleteForOneSide={() =>
                                        handleDeleteMessage(false, message)
                                      }
                                      deleteForAllSide={() =>
                                        handleDeleteMessage(true, message)
                                      }
                                    />
                                  ) : (
                                    <ReceivedGroupImages
                                      Logo={userLogo}
                                      attachedMessages={message.messageContent}
                                      deletedForOneSide={() => {
                                        handleDeleteMessage(false, message);
                                      }}
                                      index={index}
                                      messageTiming={message.sendingTime}
                                      receivedImages={message.fileUrl}
                                      senderName={message.senderName}
                                      senderPicture={
                                        message.senderProfilePicture
                                      }
                                      selectedIndex={deletingMessageIndex}
                                      onSelected={() => {
                                        if (deletingMessageIndex === -1)
                                          setDeletingMessageIndex(index);
                                        else setDeletingMessageIndex(-1);
                                      }}
                                      viewFile={() => {
                                        ViewFiles(index);
                                        setDeletingMessageIndex(-1);
                                      }}
                                    />
                                  )}
                                </div>
                              ) : null}

                              {message.multipartRequestFlag &&
                              message.fileType === "video" ? (
                                <div>
                                  {message.senderID === currentUserID ? (
                                    <SendedVideoComponent
                                      attachedMessage={message.messageContent}
                                      messageTiming={message.sendingTime}
                                      videoURl={message.fileUrl}
                                      viewFile={() => ViewFiles(index)}
                                      index={index}
                                      selectedIndex={deletingMessageIndex}
                                      onSelected={() => {
                                        if (deletingMessageIndex === -1)
                                          setDeletingMessageIndex(index);
                                        else setDeletingMessageIndex(-1);
                                      }}
                                      deleteForOneSide={() =>
                                        handleDeleteMessage(false, message)
                                      }
                                      deleteForAllSide={() =>
                                        handleDeleteMessage(true, message)
                                      }
                                      viewFile={() => {
                                        ViewFiles(index);
                                        setDeletingMessageIndex(-1);
                                      }}
                                    />
                                  ) : (
                                    <ReceivedGroupVideos
                                      Logo={userLogo}
                                      attachedMessages={message.messageContent}
                                      index={index}
                                      senderName={message.senderName}
                                      senderPicture={
                                        message.senderProfilePicture
                                      }
                                      selectedIndex={deletingMessageIndex}
                                      onSelected={() => {
                                        if (deletingMessageIndex === -1)
                                          setDeletingMessageIndex(index);
                                        else setDeletingMessageIndex(-1);
                                      }}
                                      deletedForOneSide={() =>
                                        handleDeleteMessage(false, message)
                                      }
                                      messageTiming={message.sendingTime}
                                      videoUrl={message.fileUrl}
                                      viewFile={() => {
                                        ViewFiles(index);
                                        setDeletingMessageIndex(-1);
                                      }}
                                    />
                                  )}
                                </div>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={bottomView} />
                </div>
              ) : (
                <ViewFilesComponent
                  files={showFile}
                  closingFunction={() => ViewFiles()}
                />
              )}{" "}
            </>
          )}

          {/* Footer — pinned at bottom */}
          {showMultipartRequestUi ? null : (
            <>
              {" "}
              {showFile.length === 0 ? (
                <footer className="flex items-center gap-2 px-3 py-2.5 m-2 bg-white border border-gray-200 rounded-xl shrink-0">
                  <input
                    type="text"
                    placeholder="Write your message…"
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
                    ref={demoMessage}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        HandleSendingMessage();
                      }
                    }}
                  />
                  <label className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 cursor-pointer ...">
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={MultipartRequestFunction}
                    />

                    <PaperclipIcon size={16} />
                  </label>
                  <button
                    aria-label="Send message"
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
                    onClick={HandleSendingMessage}
                  >
                    <ArrowUpIcon size={16} />
                  </button>
                </footer>
              ) : null}
            </>
          )}
        </div>
      )}
    </>
  );
}
