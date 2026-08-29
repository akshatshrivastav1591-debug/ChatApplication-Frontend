import { Link, Outlet } from "react-router-dom";
export default function MainUI() {
  return (
    <>
      <nav className="flex bg-blue-100 justify-between gap-4 font-bold">
        <div className="flex gap-4 ml-3 p-1 text-blue-700 ">
          <div className={"hover:text-blue-500"}>
            {/* <Link onClick={() => NavigationLinks("Chats")}>Chat</Link> */}
            <Link to={"/MainUI/ChatList"}>Chat</Link>
          </div>
          <div className={"hover:text-blue-500"}>
            <Link to={"/MainUI/GroupList"}>Groups</Link>
          </div>
          <div className={"hover:text-blue-500"}>
            <Link to={"/MainUI/ContactList"}>Contacts</Link>
          </div>
        </div>
        <div className="flex gap-2 mr-4 p-1 text-blue-700">
          <div className={"hover:text-blue-500"}>
            <Link to={"/MainUI/MyProfile"}>MyProfile</Link>
          </div>
          <div className={"hover:text-blue-500"}>
            <Link to={"/MainUI/Logout"}>Log out</Link>
          </div>
          <div className={"hover:text-blue-500"}>
            <Link to={"/MainUI/ReportIssue"}>Report Issue</Link>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}
