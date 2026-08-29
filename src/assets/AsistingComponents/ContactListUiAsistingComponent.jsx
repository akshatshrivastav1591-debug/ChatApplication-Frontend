import Logo from "../NOProfileImage.jpg"
import { useState } from "react";
export function ContactListUiUtility({profilePicture,Name,OnSelecting}){
  const [errorImage,setErrorImage]=useState(false);
    return (
                <>
        <div className="flex items-center gap-2 rounded-xl active:bg-blue-300 sm:hover:bg-blue-300 p-2" onClick={OnSelecting}>
      <label className="w-10 h-10 shrink-0 bg-blue-300 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
        <img
          src={!profilePicture ||errorImage?Logo:profilePicture}
          alt={"No Image is found"}
          className="w-full h-full object-cover"
          onError={()=>{
            setErrorImage(true);
          }}
        />
      </label>
      <div className="flex flex-col min-w-0">
        <span className="font-bold text-sm truncate">{Name}</span>
        
      </div>
    </div>
        </>
    )
}