import { useState, useRef, useContext } from "react";

import Cropper from "react-easy-crop";
import { Buttons } from "../Buttons";
import { Loader } from "../Loader";
import Logo from "../assets/NOProfileImage.jpg";
import { contextStoringContactDetails } from "../assets/ContexApi/ContextApiStore";
import { API_BASE_URL } from "../Config/api";

export function CreateGroupUi({ closingFunction }) {
  //Context
  const { ContactInfoList } = useContext(contextStoringContactDetails);

  //refs
  const groupName = useRef();

  //State for setting up profilePicture
  const [image, setimage] = useState(null);
  const [crop, setcrop] = useState({ x: 0, y: 0 });
  const [zoom, setzoom] = useState(1);
  const [croppedAreapixels, setcroppedAreapixels] = useState(null);
  const [ProfilePicture, setProfilePicture] = useState(Logo);
  const [selectedUser, SetSelectedUSer] = useState([]);

  //state for some ui
  const [showCropper, setshowCropper] = useState(false);
  const [showButton, setShowButton] = useState(true);

  //LoadingScreen
  const [Loading, setLoading] = useState(false);

  //Error Message
  const [error, setError] = useState(null);
  //-->settting UpProfile Picture
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
  //Creating userProfile
  async function createNewGroup() {
    setShowButton(false);

    setLoading(true);

    try {
      let groupData;

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
          groupData = {
            groupLogoPublicId: cloudinaryData.public_id,
            groupLogoType: cloudinaryData.resource_type,
            groupName: groupName.current.value,
            groupMembers: selectedUser,
            groupLogoUrl: cloudinaryData.secure_url,
            groupID: null,
          };
        } else {
          throw new Error("Cloudinary Exception");
        }
      } else {
        groupData = {
          groupLogoPublicId: null,
          groupLogoType: null,
          groupName: groupName.current.value,
          groupMembers: selectedUser,
          groupLogoUrl: null,
          groupID: null,
        };
      }

      const response = await fetch(`${API_BASE_URL}/createNewGroup`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(groupData),
      });
      const data = await response.json();
      if (response.ok) {
        setLoading(false);

        closingFunction();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setShowButton(true);
    }
  }
  function toggleUser(roomId) {
    SetSelectedUSer((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId],
    );
    
  }

  return (
    <>
      <div className="bg-blue-100 font-bold flex flex-col items-center py-10 px-4 gap-6">
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
            <div>Enter your Group Logo:</div>
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
                className="bg-blue-200 p-2 rounded border-2 w-full"
                ref={groupName}
              />
            </div>
          </div>
        </div>
        <div className="justify-center w-full max-w-md">
          <div>{Loading ? <Loader /> : null}</div>

          <div className="flex flex-col gap-2 w-full">
            <label>Add Contacts</label>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto border-2 rounded p-2 bg-blue-50">
              {ContactInfoList && ContactInfoList.length > 0 ? (
                ContactInfoList.map((contact) => (
                  <label
                    key={contact.contactId}
                    className="flex items-center gap-3 p-1 rounded cursor-pointer active:bg-blue-100 sm:hover:bg-blue-100"
                  >
                    <input
                      type="checkbox"
                      className="shrink-0"
                      checked={selectedUser.includes(contact.roomId)}
                      onChange={() => toggleUser(contact.roomId)}
                    />
                    <img
                      src={contact.profilePhotoUrl || Logo}
                      alt="contact"
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <span className="truncate min-w-0">{contact.savedName}</span>
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
          {showButton ? (
            <>
              <Buttons OnChange={createNewGroup}>Create Group</Buttons>
              <Buttons OnChange={closingFunction}>Back</Buttons>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}