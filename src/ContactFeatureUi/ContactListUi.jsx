import { useEffect, useState, useContext } from "react";
import { Loader } from "../Loader";
import { ContactListUiUtility } from "../assets/AsistingComponents/ContactListUiAsistingComponent";
import { useNavigate } from "react-router-dom";
import { OptionsForUser } from "./Options";
import { Buttons } from "../Buttons";
import {
  contextStoringContactDetails,
  contextRefetchingChatDetails,
  contextRefetchingContactDetails,
} from "../assets/ContexApi/ContextApiStore";
import { API_BASE_URL } from "../Config/api";
export function ContactList() {
  const Navigate = useNavigate();
  const { ContactInfoList, SetContactInfoList } = useContext(
    contextStoringContactDetails,
  );
  const { setFetchChatDetails } = useContext(contextRefetchingChatDetails);
  const { fetchContactDetails, setFetchContactDetails } = useContext(
    contextRefetchingContactDetails,
  );
  const [Empty, SetEmpty] = useState(false);
  const [Loading, SetLoading] = useState(false);
  const [Errors, SetErrors] = useState(false);
  const [ShowOptions, setShowOptions] = useState(null);

  useEffect(() => {
    async function FetchingContactDetails() {
      if (!fetchContactDetails) {
        return;
      }
      SetLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/getAllContacts`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Connection is not established,Please try again:");
        }
        const data = await response.json();
        if (data.contactLists.length === 0) {
          SetEmpty(true);
        } else {
          SetContactInfoList(data.contactLists);
          SetEmpty(false);
          setFetchContactDetails(false);
        }
      } catch {
        SetErrors(true);
      } finally {
        SetLoading(false);
      }
    }
    FetchingContactDetails();
  }, [fetchContactDetails]);
  function NavigateToEditContact(index) {
    Navigate("/MainUI/EditContact", {
      state: { ContactInfo: ContactInfoList[index] },
    });
  }
  function NavigateToViewProfilePicture(index) {
    Navigate("/MainUI/ViewProfilePicture", {
      state: { ContactInfo: ContactInfoList[index] },
    });
  }
  async function NavigateToChatUi(index) {
    try {
      const chatDetails = {
        ContactNo: ContactInfoList[index].savedUserContactNo,
        roomId: ContactInfoList[index].roomId,
      };
      const response = await fetch(`${API_BASE_URL}/isNewContact`, {
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(chatDetails),
      });
      const data = await response.json();
      if (response.ok && data.isBlocked && !data.isFirstChat) {
        if (data.blockedByUserID === ContactInfoList[index].contactUserId)
          throw new Error(
            "You can't send message to this chat,You are Blocked:",
          );
        else
          throw new Error(
            "You have Blocked this user.Please unblock to sendMEssage",
          );
      }
      if (response.ok && data.isFirstChat) {
        setFetchChatDetails(true);
        Navigate("/MainUI/ChatList", {
          state: { roomID: data.roomId },
        });
        return;
      }
      if (response.ok && !data.isFirstChat && !data.isBlocked) {
        Navigate("/MainUI/ChatList", {
          state: { roomID: data.roomId },
        });
        return;
      } else {
        throw new Error("Something went wrong with backend:");
      }
    } catch (error) {
      SetErrors(error.message);
    }
  }
  function ShowOption(index) {
    if (ShowOptions == -1) setShowOptions(index);
    else {
      setShowOptions(-1);
    }
  }
  function NavigatngToAddContactPage() {
    Navigate("/MainUI/AddContact");
  }
  return (
    <>
      <div>
        <div>
          <div className="mt-3">
            <Buttons OnChange={NavigatngToAddContactPage}>
              + Add Contact
            </Buttons>
          </div>
          {Loading ? (
            <Loader />
          ) : (
            <div>
              {Errors ? (
                <div className="font-extrabold">{Errors}</div>
              ) : Empty ? (
                "No contacts are added:"
              ) : (
                <div className="ml-1.5 mt-2 bg-blue-200 flex flex-col w-full sm:w-1/2 lg:w-1/5 rounded-xl">
                  {ContactInfoList.map((contact, index) => (
                    <div key={index}>
                      <ContactListUiUtility
                        profilePicture={contact.profilePhotoUrl}
                        Name={contact.savedName}
                        key={index}
                        OnSelecting={() => ShowOption(index)}
                      />
                      {ShowOptions === index && ShowOptions !== -1 ? (
                        <OptionsForUser
                          onChat={() => NavigateToChatUi(index)}
                          onEditContact={() => NavigateToEditContact(index)}
                          onViewProfilePicture={() =>
                            NavigateToViewProfilePicture(index)
                          }
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
}