import { useState } from "react";
import { ConfirmationModal } from "./ConfirmationModel";
import { fetchedGroupDetailsSliceActions } from "../assets/Redux/FetchedGroupDetailsSlice";
import { useDispatch } from "react-redux";
import { ErrorComponent } from "./ErrorMesssage";
import { API_BASE_URL } from "../Config/api";

export function OnClickOptionForUsers({
  viewOptions,
  closingFunction,
  isAdmin,
  groupID,
  setViewFeature,
  setShowGroupInfoFunction,
}) {
  //--> States
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [errors, setErrors] = useState(false);

  //-->Redux feature
  const dispatch = useDispatch();
  //--> function for leaving  and deleting group
  async function handelLeaveAndDeletionOfGroup() {
    try {
      const groupData = {
        groupLogoPublicId: null,
        groupLogoType: null,
        groupName: null,
        groupMembers: null,
        groupLogoUrl: null,
        groupID: groupID,
      };
      const response = await fetch(`${API_BASE_URL}/deleteGroupMember`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify(groupData),
      });
      if (response.ok) {
        dispatch(
          fetchedGroupDetailsSliceActions.deletingUserFromFetchedGroupDetails(
            groupID,
          ),
        );
      } else {
        throw new Error("Something wrong with Server:");
      }
    } catch (error) {
      setErrors(true);
    } finally {
      setShowLeaveConfirm(false);
      setViewFeature();
    }
  }

  return (
    <>
      <ul className="bg-blue-100 w-40 rounded-xl overflow-hidden divide-y divide-blue-200">
        {viewOptions ? (
          <>
            {isAdmin ? (
              <>
                <li
                  className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
                  onClick={setShowGroupInfoFunction}
                >
                  viewAndEditGroup
                </li>

                <li
                  className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
                  onClick={() => setShowLeaveConfirm(true)}
                >
                  Leave and Delete Group
                </li>
              </>
            ) : (
              <>
                <li
                  className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
                  onClick={setShowGroupInfoFunction}
                >
                  view groupInfo
                </li>
                <li
                  className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
                  onClick={() => setShowLeaveConfirm(true)}
                >
                  Leave and Delete Group
                </li>
              </>
            )}
            <li
              className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
              onClick={closingFunction}
            >
              Close
            </li>
          </>
        ) : null}
      </ul>

      <ConfirmationModal
        isOpen={showLeaveConfirm}
        title={"Leave Group?"}
        message={
          "You won't be able to see messages in this group once you leave."
        }
        confirmText={"Leave"}
        onCancel={() => setShowLeaveConfirm(false)}
        onConfirm={handelLeaveAndDeletionOfGroup}
      />

      {errors ? <ErrorComponent /> : null}
    </>
  );
}