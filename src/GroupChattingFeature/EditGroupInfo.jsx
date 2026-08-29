import { useState, useEffect, useContext, useRef } from "react";
import { fetchedGroupDetailsSliceActions } from "../assets/Redux/FetchedGroupDetailsSlice";
import { contextStoringContactDetails } from "../assets/ContexApi/ContextApiStore";
import Cropper from "react-easy-crop";
import { Buttons } from "../Buttons";
import Logo from "../assets/NOProfileImage.jpg";
import { Loader } from "../Loader";
import { ShowEditedData } from "./ViewChangedData";
import { useDispatch } from "react-redux";
import { API_BASE_URL } from "../Config/api";
export function EditGroupInfo({
  groupID,
  groupLogo,
  groupName,

  closingFunction,
}) {
  //States to store and show the updated data before sending it to backend
  const [listOfNewMembers, setListOFNewMembers] = useState([]);
  const [listOfRemovedMember, setListOfRemovedMember] = useState([]);
  const [listOFAppointedAdmin, setListOfAppointedAdmin] = useState([]);
  //-->States for fetching GroupDetails
  const [groupMembers, setGroupMembers] = useState([]);
  //refs
  const updatedGroupName = useRef();
  //--> redux
  const dispatch = useDispatch();

  //state for some ui
  const [showCropper, setshowCropper] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [unAddedContacts, setUnAddedContacts] = useState([]);

  //State for setting up profilePicture
  const [image, setimage] = useState(null);
  const [crop, setcrop] = useState({ x: 0, y: 0 });
  const [zoom, setzoom] = useState(1);
  const [croppedAreapixels, setcroppedAreapixels] = useState(null);
  const [ProfilePicture, setProfilePicture] = useState(groupLogo);

  //Context
  const { ContactInfoList } = useContext(contextStoringContactDetails);

  function viewProfilePicture(e) {
    const file = e.target.files[0];
    if (file) {
      setimage(URL.createObjectURL(file));
      setshowCropper(true);
    }
  }
  const onCropComplete = (croppedArea, croppedAreapixels) => {
    setcroppedAreapixels(croppedAreapixels);
  };
  const OnSelected = async () => {
    if (!image || !croppedAreapixels) return;
    const ProecessedImage = await getProcessedImage(image, croppedAreapixels);
    setProfilePicture(ProecessedImage);

    setshowCropper(false);
  };
  const getProcessedImage = (imageSrc, cropedArea) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageSrc;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropedArea.width;
        canvas.height = cropedArea.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          cropedArea.x,
          cropedArea.y,
          cropedArea.width,
          cropedArea.height,
          0,
          0,
          cropedArea.width,
          cropedArea.height,
        );
        resolve(canvas.toDataURL("image/png", 0.8));
      };
      img.onerror = () => {
        reject("failed to load image:");
      };
    });
  };
  //-converting the url to a file
  function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);

    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
  // --> fetching the groupMemebrsInfo
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
          setGroupMembers(data.data);
          const memberIds = new Set(data.data.map((m) => m.userID));
          const updatedContacts = ContactInfoList.filter(
            (contact) => !memberIds.has(contact.contactUserId),
          );
          setUnAddedContacts(updatedContacts);
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

  async function handleGroupUpdate() {
    try {
      setLoading(true);
      let updatedGroupData;

      if (ProfilePicture && ProfilePicture.startsWith("data:")) {
        const blob = dataURLtoBlob(ProfilePicture);
        //imageFile
        const imageFile = new File([blob], "profilepicture.jpg", {
          type: blob.type,
        });
        // if (isImageSelectedByUser) {
        const sendingFile = new FormData();
        sendingFile.append("file", imageFile);
        sendingFile.append("upload_preset", "GroupChatLogo");
        sendingFile.append("cloud_name", "dm2a2akgj");
        sendingFile.append("folder", "GroupChatLogos");
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/dm2a2akgj/auto/upload`,
          {
            method: "POST",
            body: sendingFile,
          },
        );
        const cloudinaryData = await cloudinaryResponse.json();
        if (cloudinaryResponse.ok) {
          updatedGroupData = {
            updatedGroupLogoPublicId: cloudinaryData.public_id,
            updatedGroupLogoType: cloudinaryData.resource_type,
            updatedName: updatedGroupName.current.value,
            updatedGroupLogoUrl: cloudinaryData.secure_url,
            newMembers: listOfNewMembers,
            newAdmins: listOFAppointedAdmin,
            removedMember: listOfRemovedMember,
            groupID: groupID,
          };
        } else {
          throw new Error("Cloudinary Exception");
        }
      } else {
        updatedGroupData = {
          updatedGroupLogoPublicId: null,
          updatedGroupLogoType: null,
          updatedName: updatedGroupName.current.value,
          updatedGroupLogoUrl: null,
          newMembers: listOfNewMembers,
          newAdmins: listOFAppointedAdmin,
          removedMember: listOfRemovedMember,
          groupID: groupID,
        };
      }
     
      const response = await fetch(`${API_BASE_URL}/updateGroupInfo`, {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        method: "PUT",
        body: JSON.stringify(updatedGroupData),
      });
      const updatedGroupInfoData = await response.json();
      if (response.ok) {
        dispatch(fetchedGroupDetailsSliceActions.setRefetchingFlag(true));
        closingFunction();
      } else throw new Error(updatedGroupInfoData.message);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="bg-blue-100 font-bold flex flex-col items-center py-10 px-4 gap-6 max-h-[85vh] overflow-y-auto">
        <div className="bg-blue-100 font-bold flex flex-col items-center w-full py-10 gap-6">
          {/* Title */}
          <h1 className="text-center text-lg">Let's Create a new Group</h1>

          {showCropper ? (
            <div className=" relative w-full h-80">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                onCropChange={setcrop}
                onZoomChange={setzoom}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : (
            <>
              <div> Group Logo:</div>
              <label className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
                <img
                  src={ProfilePicture}
                  alt="Image Not found:"
                  className="w-full h-full object-cover"
                />
                <input
                  type="file"
                  className="hidden"
                  onChange={viewProfilePicture}
                />
              </label>
            </>
          )}
          {showCropper ? (
            <div>
              <Buttons OnChange={OnSelected}>Select Image</Buttons>
            </div>
          ) : null}
          {/* Form */}

          <div className="flex flex-col gap-4 w-full max-w-md">
            {/* Row 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col w-full">
                <label>Group Name</label>
                <input
                  ref={updatedGroupName}
                  className="bg-blue-200 p-2 rounded border-2 w-full"
                  placeholder={groupName}
                />
              </div>
            </div>
          </div>
          <div className="justify-center w-full max-w-md">
            <div>{Loading ? <Loader /> : null}</div>
            <div className="flex flex-col gap-2 w-full">
              {showAddPanel ? (
                <label>Add New Group Members</label>
              ) : (
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label>Group Members</label>
                  <div>
                    {(listOfNewMembers === null ||
                      listOfNewMembers.length === 0) &&
                    showAddPanel === false ? (
                      <Buttons OnChange={() => setShowAddPanel(true)}>
                        Add More Members:
                      </Buttons>
                    ) : null}
                  </div>
                </div>
              )}
              {showAddPanel ? (
                <>
                  <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border-2 rounded p-2 bg-blue-50">
                    {unAddedContacts && unAddedContacts.length > 0 ? (
                      unAddedContacts.map((contact) => (
                        <label
                          key={contact.contactUserId}
                          className="flex items-center justify-between gap-3 p-2 rounded cursor-pointer active:bg-blue-100 sm:hover:bg-blue-100"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={contact.profilePhotoUrl || Logo}
                              alt="contact"
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                            <span className="font-normal truncate">
                              {contact.savedName}
                            </span>
                          </div>

                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-blue-600 flex-shrink-0"
                            checked={listOfNewMembers.some(
                              (element) =>
                                element.contactUserId === contact.contactUserId,
                            )}
                            onChange={() =>
                              setListOFNewMembers((prevValues) => {
                                const alreadyAdded = prevValues.some(
                                  (element) =>
                                    element.contactUserId ===
                                    contact.contactUserId,
                                );
                                return alreadyAdded
                                  ? prevValues.filter(
                                      (element) =>
                                        element.contactUserId !==
                                        contact.contactUserId,
                                    )
                                  : [...prevValues, contact];
                              })
                            }
                          />
                        </label>
                      ))
                    ) : (
                      <div className="font-normal text-gray-500">
                        No contacts left to add
                      </div>
                    )}
                  </div>

                  <Buttons
                    OnChange={() => {
                      setShowAddPanel(false);
                    }}
                  >
                    Confirm New Added Members
                  </Buttons>
                </>
              ) : (
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border-2 rounded p-2 bg-blue-50">
                  {groupMembers && groupMembers.length > 0 ? (
                    groupMembers.map((member) => (
                      <div
                        key={member.userID}
                        className="flex items-center justify-between gap-3 p-2 rounded active:bg-blue-100 sm:hover:bg-blue-100 flex-wrap"
                      >
                        {/* Left: avatar + name + admin tag */}
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={member.userProfilePicture || Logo}
                            alt="contact"
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                          <span className="font-normal truncate">
                            {member.contactSavedName}
                          </span>
                          {member.Admin && (
                            <span className="text-xs font-normal text-blue-600 bg-blue-200 rounded-full px-2 py-0.5 flex-shrink-0">
                              Admin
                            </span>
                          )}
                        </div>

                        {/* Right: action buttons */}
                        <div className="flex gap-2 flex-wrap">
                          {!member.Admin && (
                            <button
                              type="button"
                              className="text-xs font-medium text-blue-700 bg-blue-50 active:bg-blue-200 sm:hover:bg-blue-100 border border-blue-200 rounded-full px-3 py-1 transition-colors"
                              onClick={() => {
                                setListOfAppointedAdmin((preValues) => {
                                  const index = preValues.findIndex(
                                    (element) =>
                                      element.userID === member.userID,
                                  );

                                  if (index === -1) {
                                    const updatedValues = [
                                      ...preValues,
                                      member,
                                    ];
                                    return updatedValues;
                                  } else {
                                    const updatedValues = [...preValues];
                                    const index = updatedValues.findIndex(
                                      (element) =>
                                        element.userID === member.userID,
                                    );
                                    updatedValues.splice(index, 1);
                                    return updatedValues;
                                  }
                                });
                              }}
                            >
                              <>
                                {(() => {
                                  const index = listOFAppointedAdmin.findIndex(
                                    (element) =>
                                      element.userID === member.userID,
                                  );
                                  if (index === -1) return "Appoint Admin";
                                  else return "Remove Admin";
                                })()}
                              </>
                            </button>
                          )}
                          <button
                            type="button"
                            className="text-xs font-medium text-red-600 bg-red-50 active:bg-red-200 sm:hover:bg-red-100 border border-red-200 rounded-full px-3 py-1 transition-colors"
                            onClick={() => {
                              setListOfRemovedMember((prevValues) => {
                                const index = prevValues.findIndex(
                                  (element) => element.userID === member.userID,
                                );
                                if (index === -1) {
                                  const updatedValues = [...prevValues, member];
                                  return updatedValues;
                                } else {
                                  const updatedValues = [...prevValues];
                                  const index = updatedValues.findIndex(
                                    (element) =>
                                      element.userID === member.userID,
                                  );
                                  updatedValues.splice(index, 1);
                                  return updatedValues;
                                }
                              });
                            }}
                          >
                            {(() => {
                              const index = listOfRemovedMember.findIndex(
                                (element) => element.userID === member.userID,
                              );
                              if (index === -1) return "Remove";
                              else return "ADD Again";
                            })()}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="font-normal text-gray-500">
                      No contacts available
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-center font-bold text-red-500 mt-2">
              {!error == "" ? error : null}
            </div>
            {/* showing Newly added members */}
            {!showAddPanel &&
            listOfNewMembers.length > 0 &&
            listOfNewMembers ? (
              <ShowEditedData
                Logo={Logo}
                Topic={"Confirm Newly Added Members"}
                editedData={listOfNewMembers}
                ReEditFunction={() => {
                  setShowAddPanel(true);
                }}
                showUndoButton={false}
                undoFunction={null}
                showReditFunction={true}
              />
            ) : null}
            {/* Showing Removed Members */}
            {listOfRemovedMember && listOfRemovedMember.length > 0 ? (
              <ShowEditedData
                Logo={Logo}
                Topic={"Removed Members from current Group"}
                ReEditFunction={null}
                showReditFunction={false}
                editedData={listOfRemovedMember}
                showUndoButton={true}
                undoFunction={null}
              />
            ) : null}
            {/* Showing Appointed Admin */}
            {listOFAppointedAdmin && listOFAppointedAdmin.length > 0 ? (
              <ShowEditedData
                Logo={Logo}
                Topic={"Appointed Admin for Group"}
                ReEditFunction={null}
                showReditFunction={false}
                showUndoButton={true}
                undoFunction={null}
                editedData={listOFAppointedAdmin}
              />
            ) : null}
            <div className="mt-2">
              {Loading ? (
                <Loader />
              ) : (
                <>
                  {errorMessage === null ? (
                    <>
                      <Buttons OnChange={handleGroupUpdate}>
                        Update Group
                      </Buttons>
                      <Buttons OnChange={closingFunction}>Back</Buttons>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center font-extrabold text-red-500">
                        {errorMessage}
                      </div>
                    </>
                  )}{" "}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}