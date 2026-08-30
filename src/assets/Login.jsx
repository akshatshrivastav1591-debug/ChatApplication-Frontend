import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Buttons } from "../Buttons";
import { useRef, useState } from "react";
import { Loader } from "../Loader";
import { useContext } from "react";
import {
  contextApiWebSocketCleint,
  contextCurrentUserID,
  contextStoringIndexForChatDetail,
} from "./ContexApi/ContextApiStore";
import { fetchedGroupDetailsSliceActions } from "./Redux/FetchedGroupDetailsSlice";
import { jwtReducerSliceActions } from "./Redux/JwtTokenReducer";
import { useScreenSize } from "../GetCurrentScreenSize";
import { API_BASE_URL } from "../Config/api";
export function Login() {
  const { setIsAuthenticated } = useContext(contextApiWebSocketCleint);
  const { currentUserID, setCurrentUserID } = useContext(contextCurrentUserID);
  const { setChatIndex } = useContext(contextStoringIndexForChatDetail);
  const mobileNo = useRef();
  const password = useRef();
  const navigate = useNavigate();
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const { width} = useScreenSize();
  //redux
  const dispatch=useDispatch();
  async function UserLogin() {
    const user = {
      mobileno: mobileNo.current.value,
      password: password.current.value,
    };

    setloading(true);
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(user),
    });
    const data = await response.json();
    if (response.ok && data.firstLogin == false) {
      setloading(false);
      setIsAuthenticated(true);
      if (currentUserID === null) setCurrentUserID(data.currentUserID);
      console.log("response Object=",data);
        dispatch(jwtReducerSliceActions.setJwtToken(data.wsToken));
      if(width>768){setChatIndex(0)
        dispatch(fetchedGroupDetailsSliceActions.setSelectedGroupIndex(0));
      }
      navigate("/MainUI/ChatList");

      return;
    }

    if (response.ok && data.firstLogin == true) {
      setloading(false);
      navigate("/setUSerProfile");
      return;
    }
    if (response.status == 500) {
      seterror(data.message);
      setloading(false);
    } else {
      seterror(data.message);
      setloading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md bg-blue-100 rounded-lg">
        <div className="flex justify-center">
          <h1 className="font-bold text-xl sm:text-2xl text-center">
            Welcome to the Chatrix App
          </h1>
        </div>

        <div className="font-bold flex flex-col sm:flex-row sm:justify-center sm:items-center mt-4 gap-1 sm:gap-2">
          <span>Enter Your MobileNo:</span>
          <input
            type="text"
            className="bg-blue-200 p-1.5 sm:p-0.5 rounded border-2 w-full sm:w-auto"
            ref={mobileNo}
          />
        </div>

        <div className="font-bold flex flex-col sm:flex-row sm:justify-center sm:items-center mt-3 gap-1 sm:gap-2">
          <span>Enter Your Password:</span>
          <input
            type="password"
            className="bg-blue-200 p-1.5 sm:p-0.5 rounded border-2 w-full sm:w-auto"
            ref={password}
          />
        </div>

        <div className="flex justify-center items-center mt-4">
          <Buttons OnChange={UserLogin}>Login</Buttons>
        </div>

        <div className="flex justify-center mt-3">
          <hr className="w-full border-t-2 border-blue-300" />
        </div>

        <div className="mt-2">{loading ? <Loader /> : null}</div>

        <div className="flex justify-center font-bold text-red-500 text-center px-2">
          {!error == "" ? error : null}
        </div>

        <div className="flex justify-center mt-2 text-center">
          <h3 className="font-bold">
            New Users:
            <Link
              to={"/Register"}
              className="ml-1 text-blue-700 hover:text-blue-600"
            >
              Register here
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
}
