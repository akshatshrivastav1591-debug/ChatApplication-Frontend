import { useEffect, useState,useContext } from "react";
import { Loader } from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchedGroupDetailsSliceActions } from "../assets/Redux/FetchedGroupDetailsSlice";
import { contextStoringContactDetails,contextRefetchingContactDetails } from "../assets/ContexApi/ContextApiStore";

import Logo from "../assets/NOProfileImage.jpg";
import { ChatListUiAsistingComponent } from "../assets/AsistingComponents/ChatListUiAsistingComponent";
import { GroupChatUI } from "../assets/GroupChatUi";
import { CreateGroupUi } from "./CreateGroupUi";
import { API_BASE_URL } from "../Config/api";
export function GroupList() {
  //States
  const [Loading, setLoading] = useState(false);
  const [Errors, setErrors] = useState(null);
  const [isEmpty, setISEmpty] = useState(false);
  const [createNewGroupUi, setCreateNewGroupUi] = useState(false);
  
  //Context
    const { ContactInfoList, SetContactInfoList } = useContext(
      contextStoringContactDetails,
    );
    const { fetchContactDetails, setFetchContactDetails } = useContext(
      contextRefetchingContactDetails,
    );
  //Redux features
  const fetchedChatDetails = useSelector(
    (state) => state.fetchedGroupChatDetails.fetchedGroupDetails,
  );
  const selectedIndex = useSelector(
    (state) => state.fetchedGroupChatDetails.selectedGroupIndex,
  );
  const refetchingFlag=useSelector(state=>state.fetchedGroupChatDetails.refetchingFlag)

  const dispatch = useDispatch();
  //Function that handle the creation of new group
  function handleCreateGroup() {
    setCreateNewGroupUi((prevValue) => {
      const updatedValue = !prevValue;
      return updatedValue;
    });
  }
  //fetching chat details
  useEffect(() => {
    async function fetchingChatDetails() {
      try {
        if(!refetchingFlag) return;
        
        const response = await fetch(
          `${API_BASE_URL}/getAllGroupDetails`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        if (data.success && data.data === null) {
          setISEmpty(true);
          dispatch(fetchedGroupDetailsSliceActions.setRefetchingFlag(false))
          return;
        }
        dispatch(
          fetchedGroupDetailsSliceActions.initializeGroupChatDetails(data.data),
        );
        dispatch(fetchedGroupDetailsSliceActions.setRefetchingFlag(false))
        
      } catch (error) {
        setErrors(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchingChatDetails();
  }, [refetchingFlag]);
  //Setting Group Index
  function setGroupIndex(index) {
    dispatch(fetchedGroupDetailsSliceActions.setSelectedGroupIndex(index));
    
  }

  // //Function to fetch the  userContact data in the case user hadn't touched on the contacts section:
  useEffect(() => {
    async function fetchingContactDetails() {
      try {
        if (!fetchContactDetails || ContactInfoList.length !== 0) return;

        const response = await fetch(`${API_BASE_URL}/getAllContacts`, {
          method: "GET",
          credentials: "include",
        });

        // data.contactLists
        if (response.ok) {
          const data = await response.json();
          SetContactInfoList(data.contactLists);
          setFetchContactDetails(false);
        } else {
          throw new Error("Something wrong with server:");
        }
      } catch (error) {
        setErrors(error.message)
        
      }
    }
    fetchingContactDetails();
  }, []);
  
    return (
    <>
      {createNewGroupUi ? (
        <CreateGroupUi closingFunction={handleCreateGroup} />
      ) : (
        <div className="flex h-screen overflow-hidden">
          <div
            className={`w-full md:w-1/4 border overflow-y-auto ${
              selectedIndex !== null && selectedIndex !== undefined
                ? "hidden md:block"
                : "block"
            }`}
          >
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <span className="font-semibold">Groups</span>
              <button
                onClick={handleCreateGroup}
                className="flex items-center gap-1 text-sm px-3 py-1 border rounded hover:bg-gray-100"
              >
                <span className="text-lg leading-none">+</span> New group
              </button>
            </div>

            {Loading ? (
              <Loader />
            ) : Errors !== null ? (
              <div className="font-extrabold text-red-500 px-3 py-2">{Errors}</div>
            ) : isEmpty ? (
              <div className="font-extrabold px-3 py-2">No Chats are Available</div>
            ) : (
              <>
                {fetchedChatDetails ? (
                  <>
                    {fetchedChatDetails.map((singleGroupDetails, index) => (
                      <div key={index}>
                        <ChatListUiAsistingComponent
                          ProfilePicture={
                            singleGroupDetails.groupLogoUrl
                              ? singleGroupDetails.groupLogoUrl
                              : Logo
                          }
                          SavedName={
                            singleGroupDetails.groupName
                              ? singleGroupDetails.groupName
                              : "Not Available"
                          }
                          LastMessage={
                            singleGroupDetails.lastMessage
                              ? singleGroupDetails.lastMessage
                              : "Not Available"
                          }
                          UnseenCount={singleGroupDetails.unseenMessageCounter}
                          setIndexNO={() => setGroupIndex(index)}
                        />
                      </div>
                    ))}
                  </>
                ) : null}
              </>
            )}

            <div className="font-bold px-3 py-2">How it is going on life:</div>
          </div>
          <div
            className={`flex-1 ${
              selectedIndex !== null && selectedIndex !== undefined
                ? "block"
                : "hidden md:block"
            }`}
          >
            <GroupChatUI
              groupIcon={fetchedChatDetails[selectedIndex]?.groupLogoUrl || Logo}
              groupName={
                fetchedChatDetails[selectedIndex]?.groupName ||
                "GroupName Not Available:"
              }
              isAdmin={fetchedChatDetails[selectedIndex]?.admin || null}
              groupID={fetchedChatDetails[selectedIndex]?.groupId || null}
              userLogo={Logo}
              lastCheckedMessageId={
                fetchedChatDetails[selectedIndex]?.lastCheckedMessageID || null
              }
              unseenMessageCount={
                fetchedChatDetails[selectedIndex]?.unseenMessageCounter || 0
              }
              settingUnseenMessageCount0={() => {
                dispatch(
                  fetchedGroupDetailsSliceActions.updatingTheUnCheckedMessageCountTo0(
                    selectedIndex,
                  ),
                );
              }}
              listOfContactsInGroup={
                fetchedChatDetails[selectedIndex]?.userContactInGroup || 0
              }
              onBack={() => setGroupIndex(null)}
            />
          </div>
        </div>
      )}
    </>
  );}
