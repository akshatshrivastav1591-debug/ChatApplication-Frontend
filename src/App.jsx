import { RoutesDefination } from "./assets/RoutesDefination/RoutesDefination";
import { RouterProvider } from "react-router-dom";
import { MyContextProvider } from "./assets/ContexApi/ContextProviderFunction";
import { WebSocketConnection } from "./assets/WebSocketConnection/WebSockeConnection";
import { WebSocketPublishingComponent } from "./assets/WebSocketConnection/WebSocketPublishingComponent";
import { IndexNoProvider } from "./assets/ContexApi/IndexNoContextProvider";
import { ContextChatDetailsProviderFunction } from "./assets/ContexApi/ContextChatDetailsProviderFunction";
import { ChatDetailsRefetchingProvider } from "./assets/ContexApi/ChatDetailsRefechingProvider";
import { ContactDetailsRefetchingProvider } from "./assets/ContexApi/ContactDetailsRefetching";
import { CurrentUserIDProvider } from "./assets/ContexApi/contextCurrentUserIDProvider";
import { RecentMessageProviderFunction } from "./assets/ContexApi/contextRecentMesssageProviderFunction";
import { ShowingMultipartRequestUiContextProvider } from "./assets/ContexApi/showingMultpartRequestUiContextProvider";
import { ContextForRecentUnseenMessageProviderFunction } from "./assets/ContexApi/contextForRecentUnseenMessagesProviderFunction";
import { ContextForSubscribingIsOnlineProviderFunction } from "./assets/ContexApi/ContextForSubscribingIsOnlineProviderFunction";
function App() {
  return (
    <>
      <MyContextProvider>
        <WebSocketConnection />
        <CurrentUserIDProvider>
          <IndexNoProvider>
            <ContextChatDetailsProviderFunction>
              <ChatDetailsRefetchingProvider>
                <ContactDetailsRefetchingProvider>
                  <RecentMessageProviderFunction>
                    <ShowingMultipartRequestUiContextProvider>
                      <ContextForRecentUnseenMessageProviderFunction>
                        <ContextForSubscribingIsOnlineProviderFunction>
                          <WebSocketPublishingComponent />
                           <RouterProvider router={RoutesDefination} />
                        </ContextForSubscribingIsOnlineProviderFunction>
                      </ContextForRecentUnseenMessageProviderFunction>
                    </ShowingMultipartRequestUiContextProvider>
                  </RecentMessageProviderFunction>
                </ContactDetailsRefetchingProvider>
              </ChatDetailsRefetchingProvider>
            </ContextChatDetailsProviderFunction>
          </IndexNoProvider>
        </CurrentUserIDProvider>
      </MyContextProvider>
    </>
  );
}

export default App;
