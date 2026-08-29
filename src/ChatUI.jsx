import {
  MoreVertical,
  PaperclipIcon,
  ArrowUpIcon,
  ArrowLeft,
} from "lucide-react";
import Logo from "./assets/NOProfileImage.jpg";
import {
  useRef,
  useContext,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import {
  contextApiWebSocketCleint,
  contextCurrentUserID,
  contextRecentMessage,
  showingMultipartRequestUi,
  contextForSubscribingIsOnline,
} from "./assets/ContexApi/ContextApiStore";
import { Loader } from "./Loader";
import { DateFeedFunction } from "./assets/AsistingComponents/ChatLIstAssistingComponents/DateFeedAsistsing";
import { SendedMessageField } from "./assets/AsistingComponents/ChatLIstAssistingComponents/SendedMessaageFeed";
import { ReceivedMessages } from "./assets/AsistingComponents/ChatLIstAssistingComponents/RecievedMessages";
import { MultiPartRequestComponent } from "./assets/MultiPartRequestComponent";
import { CompressingFiles } from "./assets/CompressingFiles";
import { SendedImageComponent } from "./assets/AsistingComponents/ChatLIstAssistingComponents/SendedImage";
import { ReceivedImages } from "./assets/AsistingComponents/ChatLIstAssistingComponents/RecievedImages";
import { SendedVideoComponent } from "./assets/AsistingComponents/ChatLIstAssistingComponents/SendedVidoes";
import { ReceivedVideos } from "./assets/AsistingComponents/ChatLIstAssistingComponents/RecievdVideos";
import { FileSizeConverter } from "./assets/FileSizeConverter";
import { SendedFile } from "./assets/AsistingComponents/ChatLIstAssistingComponents/SendedFile";
import { ReceivedFile } from "./assets/AsistingComponents/ChatLIstAssistingComponents/ReceivedFile";
import { InitializeSounds } from "./assets/SoundsComponent/SoundsComponeent";
import { ViewFilesComponent } from "./assets/ViewFileComponent";
import {
  ReceivingMessageSound,
  SendingMessageSound,
} from "./assets/SoundsComponent/SoundsComponeent";
import { RecentMessageStyle } from "./assets/RecentMessaeStyle";
import { OnClickedOptionForSingleChat } from "./onClickOptionForSingleChat";
import { API_BASE_URL } from "./Config/api";

export function ChatUi({
  profilePicture,
  Name,
  roomID = -1,
  userID,
  unseenMessageCount,
  updatingUnseenMessageCount0,
  isblocked,
  blockedbyUserID,
  onBack,
}) {
  const [isOtherUserIsActive, setIsOtherUserIsActive] = useState(false);
  const bottomView = useRef();
  const unseenDividedRef = useRef();
  const cursorRef = useRef({ date: null, time: null });
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [unseenMessageIndex, setUnseenMessageIndex] = useState(-1);
  const [
    loadingIndicatorForMultipartRequest,
    setLoadingIndicatorForMultipartRequest,
  ] = useState(false);

  const [showDeleteMessageOption, setShowDeleteMessageOption] = useState(-1);
  const [isEmpty, setIsEmpty] = useState(false);
  const [scroll, setScroll] = useState(true);
  const [Error, setError] = useState(false);
  const [scrollTarget, setScrollTarget] = useState("bottom");
  const [localUnseenMessageCount, setLocalUnseenMessageCount] = useState(0);
  const [errorImage, setErrorImage] = useState(false);
  const isFetchingRef = useRef(false);
  const [Loading, setLoading] = useState(false);
  const [sendingFile, setSendingFile] = useState([]);
  const [objectUrls, setObjectUrls] = useState([]);
  const [viewChatProfile, setViewChatProfile] = useState(false);
  const [showFile, SetShowFile] = useState([]);
  const messageBody = useRef();
  const { subscribedToOnline } = useContext(contextForSubscribingIsOnline);
  const { client } = useContext(contextApiWebSocketCleint);
  const { currentUserID } = useContext(contextCurrentUserID);
  const { recentMessage, setRecentMessage } = useContext(contextRecentMessage);
  const { showMultipartRequestUi, setShowMultipartRequestUi } = useContext(
    showingMultipartRequestUi,
  );
  const pendingScrollAdjustRef = useRef(false);
  const prevScrollHeightRef = useRef(0);
  const scrollContainerRef = useRef();

  function handleScroll() {
    if (isFetchingRef.current) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    if (container.scrollTop < 300) {
      isFetchingRef.current = true;
      fetchingRemainingMessages();
    }
  }

  //Show Delete Message Option
  function setShowDeletelMessageUi(index) {
    if (showDeleteMessageOption === -1) setShowDeleteMessageOption(index);
    else {
      setShowDeleteMessageOption(-1);
    }
  }

  //Delete Message function for all sides
  async function deleteMessage(index) {
    const flag = true;
    const deletingMessageObject = fetchedMessages[index];
    setShowDeleteMessageOption(-1);
    const response = await fetch(
      `${API_BASE_URL}/deleteMesssage/${flag}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(deletingMessageObject),
      },
    );
    if (!response.ok) {
      console.log("Something went wrong:");
    }
  }
  // Delete Message for any one side
  async function deleteMessageForOneSide(index) {
    const flag = false;
    const deletingMessageObject = fetchedMessages[index];
    const response = await fetch(
      `${API_BASE_URL}/deleteMesssage/${flag}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(deletingMessageObject),
      },
    );
    if (response.ok) {
      setShowDeleteMessageOption(-1);
      setFetchedMessages((prevDetails) => {
        const updatedValues = [...prevDetails];
        updatedValues.splice(index, 1);
        return updatedValues;
      });
    }
  }
  //Is online method
  useEffect(() => {
    if (!subscribedToOnline) return;

    if (!client || !client.connected) return;
    const subscription = client.subscribe(
      `/topic/isOnline/${roomID}`,
      (message) => {
        const response = JSON.parse(message.body);

        if (response.userAvailability != null) {
          const isAvailalble = response.userAvailability[userID] === true;
          setIsOtherUserIsActive(isAvailalble);
          return;
        }
        if (response.messageDeletionID != null) {
          const messageId = response.messageDeletionID;
          setFetchedMessages((prevDetails) => {
            const index = prevDetails.findIndex(
              (details) => details.messageID === messageId,
            );
            if (index === -1) return prevDetails;
            const updatedValues = [...prevDetails];
            updatedValues.splice(index, 1);
            return updatedValues;
          });
        }
      },
    );
    

    return () => {
      subscription.unsubscribe();
      setUnseenMessageIndex(-1);
    };
  }, [client, subscribedToOnline, roomID]);
  //reseting the isfetchref
  useEffect(() => {
    cursorRef.current = {
      date: null,
      time: null,
    };
    isFetchingRef.current = false;
  }, [roomID]);
  useLayoutEffect(() => {
    if (!pendingScrollAdjustRef.current) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const newScrollHeight = container.scrollHeight;
    const heightDifference = newScrollHeight - prevScrollHeightRef.current;
    container.scrollTop += heightDifference; // push scroll position down by exactly how much content grew above it

    pendingScrollAdjustRef.current = false;
  }, [fetchedMessages]);
  async function fetchingRemainingMessages() {
    try {
      setScroll(false);
      if (scrollContainerRef.current) {
        prevScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
      }

      const { date: lastMessageSendingDate, time: lastMessageSendingTime } =
        cursorRef.current;
      const response = await fetch(
        `${API_BASE_URL}/fetchRemainingMessage/${roomID}/${lastMessageSendingDate}/${lastMessageSendingTime}`,
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
        console.log("Something Went Wrong");
        isFetchingRef.current = false;
        return;
      }
      const data = await response.json();
      if (data.length > 0) {
        cursorRef.current = {
          date: data[0].sendingDate,
          time: data[0].sendingTime,
        }; // update cursor immediately, synchronously
      }
      pendingScrollAdjustRef.current = true;
      setFetchedMessages((prev) => [...data, ...prev]);
      isFetchingRef.current = false;
    } catch (error) {
      isFetchingRef.current = false;
    }
  }
  async function TestingSendingMEssage() {
    if (messageBody.current.value === null || messageBody.current.value === "")
      return;
    setUnseenMessageIndex(-1);
    if (!client || !client.connected) {
      return;
    }

    client.publish({
      destination: `/app/sendMessage/${roomID}`,
      body: JSON.stringify({
        content: messageBody.current.value,
        isUserAvailable: isOtherUserIsActive,
      }),
    });
    messageBody.current.value = "";
  }
  //updating the error image for a  re-rendering
  useEffect(() => {
    async function updatingErrorImageState() {
      setErrorImage(false);
    }
    updatingErrorImageState();
  }, [profilePicture]);

  useEffect(() => {
    if (!scroll) return;
    if (scrollTarget === "bottom") {
      bottomView.current?.scrollIntoView({
        behavior: "instant",
      });
    } else {
      unseenDividedRef.current?.scrollIntoView({
        behavior: "instant",
      });
    }
  }, [fetchedMessages, roomID,showFile]);
  useEffect(() => {
    InitializeSounds();
  }, []);
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

  function ViewFiles(viewIndex) {
    if (showFile.length === 0) {
      const viewFile = fetchedMessages[viewIndex];
      const otherFiles = fetchedMessages.filter(
        (file) =>
          file.multipartRequest &&
          file.sendingDate === viewFile.sendingDate &&
          file.messageID !== viewFile.messageID,
      );

      const viewingFiles = [viewFile, ...otherFiles];
      // viewingFiles.push(viewFile);
      SetShowFile(viewingFiles);
    } else {
      SetShowFile([]);
      setScrollTarget("bottom");
      setScroll(true);
    }
  }

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
            sendingFile.append("upload_preset", "SendedImage");
            sendingFile.append("cloud_name", "dm2a2akgj");
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
            } else {
              console.log("Something went wrong:");
            }
          }

          //For Sending Videos
          if (file.type.startsWith("video/")) {
            const sendingFile = new FormData();
            sendingFile.append("file", compressedFiles[index]);
            sendingFile.append("upload_preset", "SendedVideos");
            sendingFile.append("cloud_name", "dm2a2akgj");
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
            } else {
              console.log("Something  went wrong:");
            }
          }
        }),
      );

      if (!client || !client.connected) {
        return;
      }
      client.publish({
        destination: `/app/multiPartRequest/${roomID}/${isOtherUserIsActive}`,
        body: JSON.stringify(
          filesAndAttachedMessagesObjectArray.filter(Boolean),
        ),
      });
      setLoadingIndicatorForMultipartRequest(false);
      setShowMultipartRequestUi(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function FetchingMessages() {
      //To ignore the re rendering of parent component (Chat List Ui in  this case:);
      if (roomID === -1) return;

      if (recentMessage !== null && recentMessage.roomId === roomID) return;
      setLoading(true);
      setUnseenMessageIndex(-1);
      setScrollTarget("bottom");
      setLocalUnseenMessageCount(0);
      try {
        const response = await fetch(
          `${API_BASE_URL}/getAllMessages/${roomID}`,
          {
            credentials: "include",
            method: "GET",
          },
        );
        if (response.status === 204) {
          setIsEmpty(true);
          setError(false);
          return;
        }
        const data = await response.json();
        if (response.ok && data !== null) {
          setScroll(true);
          setFetchedMessages(data);

          if (unseenMessageCount > 0) {
            const index = data.findIndex(
              (element) => !element.checkedByReceiver,
            );

            setUnseenMessageIndex(index);
            setLocalUnseenMessageCount(unseenMessageCount);
            setScrollTarget("divider");
          }
          updatingUnseenMessageCount0();
          setError(false);
          setIsEmpty(false);

          if (data.length > 0) {
            cursorRef.current = {
              date: data[0].sendingDate,
              time: data[0].sendingTime,
            };
          }

          return;
        }

        if (response.status === 500) {
          setError(true);
          setIsEmpty(false);
        }
      } catch (error) {
        setError(true);
        setIsEmpty(false);
        console.log("Something Went Wrong");
      } finally {
        setLoading(false);
      }
    }
    FetchingMessages();
  }, [roomID]);

  useEffect(() => {
    async function UpdatingRecentMessages() {
      if (recentMessage === null) return;
      if (recentMessage.roomId !== roomID) {
        setRecentMessage(null);
        return;
      }
      setIsEmpty(false);
      setError(false);
      setFetchedMessages((prev) => [...prev, ...recentMessage.messages]);

      setScroll(true);
      recentMessage.messages.forEach((message) => {
        if (message.senderID === currentUserID) {
          SendingMessageSound();
        } else ReceivingMessageSound();
      });

      setRecentMessage(null);
    }
    UpdatingRecentMessages();
  }, [recentMessage]);
  return (
    <>
      <div className="flex flex-col h-full bg-blue-300">
        {/* Header — fixed height */}
        <header className="flex items-center justify-between gap-2 border p-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="md:hidden flex items-center justify-center w-8 h-8 shrink-0"
              aria-label="Back to chat list"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden">
              <img
                src={!profilePicture || errorImage ? Logo : profilePicture}
                alt="profile"
                onError={() => {
                  setErrorImage(true);
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-sm">{Name}</span>
          </div>

          {viewChatProfile ? (
            <OnClickedOptionForSingleChat
              closingFunction={() => {
                setViewChatProfile(false);
              }}
            />
          ) : (
            <MoreVertical
              onClick={() => {
                setViewChatProfile(true);
              }}
            />
          )}
        </header>

        {/* Messages — grows to fill remaining space */}
        {isblocked && blockedbyUserID === currentUserID ? (
          <div className=" flex justify-center">
            <div className="w-50 flex justify-center bg-red-400 font-bold p-2">
              You have Blocked this user,To unblock please touch three lines in
              the corner
            </div>
          </div>
        ) : (
          <>
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
                        {Error ? (
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
                                  <div ref={unseenDividedRef}>
                                    <RecentMessageStyle
                                      unreadCount={localUnseenMessageCount}
                                    />
                                  </div>
                                ) : null}
                                {!message.multipartRequest &&
                                message.senderID === currentUserID ? (
                                  <SendedMessageField
                                    messageTiming={message.sendingTime}
                                    sendedMessageContent={
                                      message.messageContent
                                    }
                                    index={index}
                                    onSelected={() =>
                                      setShowDeletelMessageUi(index)
                                    }
                                    selectedIndex={showDeleteMessageOption}
                                    deleteMessage={() =>
                                      deleteMessageForOneSide(index)
                                    }
                                    deleteForAll={() => deleteMessage(index)}
                                  />
                                ) : (
                                  <>
                                    {!message.multipartRequest ? (
                                      <ReceivedMessages
                                        messagesTiming={message.sendingTime}
                                        receivedMessagesContent={
                                          message.messageContent
                                        }
                                        deletedMessage={() =>
                                          deleteMessageForOneSide(index)
                                        }
                                        index={index}
                                        selectedIndex={showDeleteMessageOption}
                                        onSelected={() =>
                                          setShowDeletelMessageUi(index)
                                        }
                                      />
                                    ) : null}{" "}
                                  </>
                                )}
                                {message.multipartRequest &&
                                message.fileType === "image" ? (
                                  <div>
                                    {message.senderID === currentUserID ? (
                                      <SendedImageComponent
                                        attachedMessage={message.messageContent}
                                        messageTiming={message.sendingTime}
                                        sendedImageUrl={message.fileUrl}
                                        viewFile={() => {
                                          ViewFiles(index);
                                          setShowDeleteMessageOption(-1);
                                        }}
                                        index={index}
                                        selectedIndex={showDeleteMessageOption}
                                        onSelected={() =>
                                          setShowDeletelMessageUi(index)
                                        }
                                        deleteForOneSide={() =>
                                          deleteMessageForOneSide(index)
                                        }
                                        deleteForAllSide={() =>
                                          deleteMessage(index)
                                        }
                                      />
                                    ) : (
                                      <ReceivedImages
                                        attachedMessages={
                                          message.messageContent
                                        }
                                        messageTiming={message.sendingTime}
                                        receivedImages={message.fileUrl}
                                        viewFile={() => {
                                          ViewFiles(index);
                                          setShowDeletelMessageUi(-1);
                                        }}
                                        index={index}
                                        selectedIndex={showDeleteMessageOption}
                                        onSelected={() =>
                                          setShowDeletelMessageUi(index)
                                        }
                                        deletedForOneSide={() =>
                                          deleteMessageForOneSide(index)
                                        }
                                      />
                                    )}
                                  </div>
                                ) : null}

                                {message.multipartRequest &&
                                message.fileType === "video" ? (
                                  <div>
                                    {message.senderID === currentUserID ? (
                                      <SendedVideoComponent
                                        attachedMessage={message.messageContent}
                                        messageTiming={message.sendingTime}
                                        videoURl={message.fileUrl}
                                        viewFile={() => {
                                          ViewFiles(index);
                                          setShowDeletelMessageUi(-1);
                                        }}
                                        index={index}
                                        selectedIndex={showDeleteMessageOption}
                                        onSelected={() =>
                                          setShowDeletelMessageUi(index)
                                        }
                                        deleteForOneSide={() =>
                                          deleteMessageForOneSide(index)
                                        }
                                        deleteForAllSide={() =>
                                          deleteMessage(index)
                                        }
                                      />
                                    ) : (
                                      <ReceivedVideos
                                        attachedMessages={
                                          message.messageContent
                                        }
                                        messageTiming={message.sendingTime}
                                        videoUrl={message.fileUrl}
                                        viewFile={() => {
                                          ViewFiles(index);
                                          setShowDeleteMessageOption(-1);
                                        }}
                                        index={index}
                                        selectedIndex={showDeleteMessageOption}
                                        onSelected={() =>
                                          setShowDeletelMessageUi(index)
                                        }
                                        deletedForOneSide={() =>
                                          deleteMessageForOneSide(index)
                                        }
                                      />
                                    )}
                                  </div>
                                ) : null}
                                {message.multipartRequest &&
                                message.fileType !== "video" &&
                                message.fileType !== "image" ? (
                                  <div>
                                    {message.senderID === currentUserID ? (
                                      <SendedFile
                                        attachedMessage={message.messageContent}
                                        fileName={message.fileName}
                                        fileSize={message.fileSize}
                                        fileUrl={message.fileUrl}
                                        messageTiming={message.sendingTime}
                                        viewFile={() => ViewFiles(index)}
                                      />
                                    ) : (
                                      <ReceivedFile
                                        attachedMessages={
                                          message.messageContent
                                        }
                                        fileName={message.fileName}
                                        fileSize={message.fileSize}
                                        fileUrl={message.fileUrl}
                                        messageTiming={message.sendingTime}
                                        viewFile={() => ViewFiles(index)}
                                      />
                                    )}
                                  </div>
                                ) : null}

                                {/* {<SendedImageComponent attachedMessage={"Sended Message"} messageTiming={"2:19"} sendedImageUrl={"not avaailable now"} />}
                       {<ReceivedImages attachedMessages={"recieved image"} messageTiming={"2:19"}/>} */}
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
            )}{" "}
          </>
        )}

        {/* Footer — pinned at bottom */}
        {isblocked && blockedbyUserID === currentUserID ? null : (
          <>
            {showMultipartRequestUi ? null : (
              <>
                {" "}
                {showFile.length === 0 ? (
                  <footer className="flex items-center gap-2 px-3 py-2.5 m-2 bg-white border border-gray-200 rounded-xl shrink-0">
                    <input
                      type="text"
                      placeholder="Write your message…"
                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400"
                      ref={messageBody}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          TestingSendingMEssage();
                        }
                      }}
                      disabled={() => {
                        if (isblocked && blockedbyUserID === currentUserID)
                          return true;
                        else return false;
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
                      onClick={TestingSendingMEssage}
                    >
                      <ArrowUpIcon size={16} />
                    </button>
                  </footer>
                ) : null}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
