import { useRef, useState } from "react";
import Logo from "./assets/NOProfileImage.jpg";
import Cropper from "react-easy-crop";
import { Buttons } from "./Buttons";
import { useNavigate } from "react-router-dom";
import { Loader } from "./Loader";
import { API_BASE_URL } from "./Config/api";
export function SetUserProfile() {
  //refs
  const firstName = useRef();
  const lastName = useRef();
  const userAdress = useRef();
  const userDateofBirth = useRef();
  //State for setting up profilePicture
  const [image, setimage] = useState(null);
  const [crop, setcrop] = useState({ x: 0, y: 0 });
  const [zoom, setzoom] = useState(1);
  const [croppedAreapixels, setcroppedAreapixels] = useState(null);
  const [ProfilePicture, setProfilePicture] = useState();

  //state for some ui
  const [showCropper, setshowCropper] = useState(false);

  //Navigation
  const navigate = useNavigate();
  //LoadingScreen
  const [Loading, setLoading] = useState(false);

  //Error Message
  const [error, seterror] = useState(null);
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
  async function createUserProfile() {
    setLoading(true);
    try {
      let userData;
      if (ProfilePicture && ProfilePicture.startsWith("data:")) {
        const blob = dataURLtoBlob(ProfilePicture);
        //imageFile
        const imageFile = new File([blob], "profilepicture.jpg", {
          type: blob.type,
        });

        const sendingFile = new FormData();
        sendingFile.append("file", imageFile);
        sendingFile.append("upload_preset", "ProfilPictures");
        sendingFile.append("cloud_name", "dm2a2akgj");
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/dm2a2akgj/auto/upload`,
          {
            method: "POST",
            body: sendingFile,
          },
        );
        const cloudinaryData = await cloudinaryResponse.json();
        if (cloudinaryResponse.ok) {
          userData = {
            imagePublicId: cloudinaryData.public_id,
            imageType: cloudinaryData.resource_type,
            userID: null,
            mobileNo: null,
            imageUrl: cloudinaryData.secure_url,
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            birthDate: userDateofBirth.current.value,
            address: userAdress.current.value,
          };
        } else {
          throw new Error("Cloudinary Exception");
        }
      } else {
        userData = {
          imagePublicId: null,
          imageType: null,
          userID: null,
          mobileNo: null,
          imageUrl: null,
          firstName: firstName.current.value,
          lastName: lastName.current.value,
          birthDate: userDateofBirth.current.value,
          address: userAdress.current.value,
        };
      }
      const response = await fetch(`${API_BASE_URL}/userProfile`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        credentials: "include",
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        navigate("/MainUI");
      } else {
        // seterror(data.message);
        // setLoading(false);
        throw new Error(data.message);
      }
    } catch (error) {
      seterror(error.message);
      setLoading(false);
    }
  }
  return (
    <>
      <div className="bg-blue-100 font-bold flex flex-col items-center py-10 px-4 gap-6">
        {/* Title */}
        <h1 className="text-center text-lg">
          Welcome to Chatrix Let's create your profile:
        </h1>

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
            <div>Enter your profile picture:</div>
            <label className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
              <img
                src={ProfilePicture ? ProfilePicture : Logo}
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label>First Name</label>
              <input
                className="bg-blue-200 p-2 rounded border-2 w-full"
                ref={firstName}
              />
            </div>

            <div className="flex flex-col w-full">
              <label>Last Name</label>
              <input
                className="bg-blue-200 p-2 rounded border-2 w-full"
                ref={lastName}
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col w-full">
              <label>Birth Date</label>
              <input
                type="date"
                className="bg-blue-200 p-2 rounded border-2 w-full"
                ref={userDateofBirth}
              />
            </div>

            <div className="flex flex-col w-full">
              <label>Address</label>
              <input
                className="bg-blue-200 p-2 rounded border-2 w-full"
                ref={userAdress}
              />
            </div>
          </div>
        </div>
        <div className="justify-center">
          <div>{Loading ? <Loader /> : null}</div>
          <div className="flex justify-center font-bold text-red-500">
            {!error == "" ? error : null}
          </div>
          <Buttons OnChange={createUserProfile}>Create Profile</Buttons>
        </div>
      </div>
    </>
  );
}