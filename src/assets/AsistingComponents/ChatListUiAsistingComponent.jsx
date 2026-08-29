import { useState,useEffect } from "react"
import Logo from "../NOProfileImage.jpg"
export function ChatListUiAsistingComponent({ProfilePicture,SavedName,LastMessage,setIndexNO,UnseenCount=0}){
  const [errorImage,setErrorImage]=useState(false);

//updating the error image for a  re-rendering
  useEffect(() => {
    async function updatingErrorImageState() {
      setErrorImage(false);
    }
    updatingErrorImageState();
  }, [ProfilePicture]);
    return(
        <div className="flex items-center gap-2  hover:bg-blue-300 p-2" onClick={setIndexNO}>
            <label className="w-10 h-10 shrink-0 bg-blue-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
              <img
                src={!ProfilePicture||errorImage?Logo:ProfilePicture}
                alt="No Picture is available:"
                className="w-full h-full object-cover"
                onError={()=>{
                  setErrorImage(true);
                }}
              />
            </label>
            <div className="flex flex-1 items-center justify-between min-w-0">
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-sm truncate">{SavedName}</span>
                <span className="text-xs text-gray-500 truncate">
                  {LastMessage}
                </span>
              </div>
              {UnseenCount > 0 ? (
                <span className="flex items-center justify-center shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-green-500 text-white text-xs font-bold">
                  {UnseenCount > 99 ? "99+" : UnseenCount}
                </span>
              ) : null}
            </div>
          </div> 
    )
}