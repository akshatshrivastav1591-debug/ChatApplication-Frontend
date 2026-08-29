import { Link, useNavigate } from "react-router-dom";
import { Buttons } from "./Buttons";
import { useRef, useState } from "react";
import { Loader } from "./Loader";
import { API_BASE_URL } from "./Config/api";

export function Register() {
  const mobileNo = useRef();
  const password = useRef();
  const [error, seterror] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  async function UserRegistration() {
    const newUserData = {
      mobileno: mobileNo.current.value,
      password: password.current.value,
    };

    setloading(true);
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUserData),
    });
    const errormessage = await response.json();

    if (response.ok) {
      setloading(false);
      navigate("/Login");
    } else {
      seterror(errormessage.message);
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
          <Buttons OnChange={UserRegistration}>Register</Buttons>
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
            Already Have Account:
            <Link
              to={"/Login"}
              className="ml-1 text-blue-700 hover:text-blue-600"
            >
              Login here
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
}