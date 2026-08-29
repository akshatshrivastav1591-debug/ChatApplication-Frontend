import { useState, useEffect } from "react";

import { Buttons } from "../Buttons";
import Logo from "../assets/NOProfileImage.jpg";
import { Loader } from "../Loader";
import { API_BASE_URL } from "../Config/api";
export function ViewGroupInfo({
  groupLogo,
  groupName,
  closingFunction,
  groupID,
}) {
  const [error, setError] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [fetchedGroupMembers, setFetchedGroupMembers] = useState([]);

  //fetching group info
  useEffect(() => {
    async function fetchingGroupInfo() {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/getAllGroupMembers/${groupID}`,
          {
            credentials: "include",
            method: "GET",
          },
        );
        const data = await response.json();
        if (response.ok) {
          setFetchedGroupMembers(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchingGroupInfo();
  }, [groupID]);

  return (
    <>
      <div className="bg-blue-100 font-bold flex flex-col items-center py-10 px-4 gap-6">
        {/* Title */}
        <h1 className="text-center text-lg">Group Info</h1>

        <label className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
          <img
            src={groupLogo}
            alt="Image Not found:"
            className="w-full h-full object-cover"
          />
          <input type="file" className="hidden" disabled={true} />
        </label>

        <div className="flex flex-col gap-4 w-full max-w-md">
          {/* Row 1 */}
          <div className="flex gap-4">
            <div className="flex flex-col w-full">
              <input
                className="bg-blue-200 p-2 rounded border-2 w-full"
                value={groupName}
              />
            </div>
          </div>
        </div>
        {Loading ? (
          <Loader />
        ) : (
          <div className="justify-center w-full max-w-md">
            <div className="flex flex-col gap-2 w-full">
              <label>GroupMembers</label>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border-2 rounded p-2 bg-blue-50">
                {fetchedGroupMembers && fetchedGroupMembers.length > 0 ? (
                  fetchedGroupMembers.map((contact) => (
                    <label
                      key={contact.userID}
                      className="flex items-center gap-3 p-1 rounded cursor-pointer active:bg-blue-100 sm:hover:bg-blue-100"
                    >
                      <img
                        src={contact.userProfilePicture || Logo}
                        alt="contact"
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <span className="truncate">{contact.contactSavedName}</span>
                    </label>
                  ))
                ) : (
                  <div className="font-normal text-gray-500">
                    No contacts available
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center font-bold text-red-500 mt-2">
              {!error == "" ? error : null}
            </div>

            <>
              <Buttons OnChange={closingFunction}>Back</Buttons>
            </>
          </div>
        )}
      </div>
    </>
  );
}