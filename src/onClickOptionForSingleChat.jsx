import { useNavigate } from "react-router-dom";

export function OnClickedOptionForSingleChat({ closingFunction }) {
  const navigate = useNavigate();
  function navigateToViewChatDetail() {
    navigate("/MainUI/ChatList/ViewChatDetails");
  }
  return (
    <>
      <ul className="bg-blue-100 w-40 rounded-xl overflow-hidden divide-y divide-blue-200">
        <li
          className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
          onClick={navigateToViewChatDetail}
        >
          ViewChatDetail
        </li>
        <li
          className="font-bold text-blue-400 active:bg-blue-200 px-3 py-2.5"
          onClick={closingFunction}
        >
          close
        </li>
      </ul>
    </>
  );
}