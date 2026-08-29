import { createBrowserRouter } from "react-router-dom";
import { Root } from "../Root";
import { Login } from "../Login";
import { FeedBack } from "../../Feedback";
import { Register } from "../../Register";
import { SetUserProfile } from "../../UserProfile";
import MainUI from "../../MainUi";
import { ChatUi } from "../../ChatUI";
import { GroupList } from "../../GroupChattingFeature/GroupListUI";
import { ContactList } from "../../ContactFeatureUi/ContactListUi";
import { MyProfile } from "../../MyProfile";
import { LogoutUi } from "../../LogoutFeature/LogoutUi";
import { ViewChatFeature } from "../../ViewChatDetails";
import { AddContactsUi } from "../../ContactFeatureUi/AddcontactUi";
import { EditContact } from "../../ContactFeatureUi/EditcontactDialog";
import { ViewProfilePicture } from "../../ContactFeatureUi/ViewProfilePicuture";
import { ChatListUi } from "../AsistingComponents/ChatListUi";
import { IssueReportingUi } from "../../IssueReporting";
export const RoutesDefination = createBrowserRouter([
  {
    path: "/",
    errorElement: <h1>Something went wrong</h1>,
    element: <Root />,
    children: [
      { path: "/Login", element: <Login /> },
      { path: "/Register", element: <Register /> },
      { path: "/setUSerProfile", element: <SetUserProfile /> },
      {
        path: "/MainUI",
        element: <MainUI />,
        children: [
          { path: "/MainUI/ChatList", element: <ChatListUi /> },
          { path: "/MainUI/GroupList", element: <GroupList /> },
          { path: "/MainUI/ContactList", element: <ContactList /> },
          { path: "/MainUI/ChatUi", element: <ChatUi /> },
          { path: "/MainUI/AddContact", element: <AddContactsUi /> },
          {
            path: "/MainUI/ViewProfilePicture",
            element: <ViewProfilePicture />,
          },
          {
            path: "/MainUI/ChatList/ViewChatDetails",
            element: <ViewChatFeature />,
          },

          { path: "/MainUI/EditContact", element: <EditContact /> },
          { path: "/MainUI/MyProfile", element: <MyProfile /> },
          { path: "/MainUI/Logout", element: <LogoutUi /> },
          { path: "/MainUI/ReportIssue", element: <IssueReportingUi /> },
        ],
      },

      { path: "/Feedback", element: <FeedBack /> },
    ],
  },
]);
