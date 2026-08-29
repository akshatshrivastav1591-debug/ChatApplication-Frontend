import { Outlet, useNavigate } from "react-router-dom";
import Logo from "./Images/ChatAppLogoTransparent.png";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { contextApiWebSocketCleint } from "./ContexApi/ContextApiStore";
import { API_BASE_URL } from "../Config/api";
export function Root() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(contextApiWebSocketCleint);
  useEffect(() => {
    async function AuthenticatingJwtToken() {
      const response = await fetch(
        `${API_BASE_URL}/authenticatingJwtToken`,
        {
          credentials: "include",
          method: "GET",
        },
      );
      if (response.ok) {
        const data = await response.json();

        setIsAuthenticated(true);
        navigate("/MainUI/ChatList");
      } else {
        navigate("/Login");
      }
    }
    AuthenticatingJwtToken();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-blue-200 px-4 sm:px-6">
      <header className="flex justify-center items-center py-4">
        <img src={Logo} alt="Image not found" className="h-16 sm:h-20" />
      </header>
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="py-4">
        <div className="flex flex-wrap justify-center text-center font-bold text-sm sm:text-base gap-x-1">
          <span>
            This is my first project. Kindly give me feedback, new ideas,
            recommendation on
          </span>
          <Link
            className="text-blue-500 font-bold hover:text-blue-600"
            to={"/Feedback"}
          >
            Feedback
          </Link>
        </div>
      </footer>
    </div>
  );
}
