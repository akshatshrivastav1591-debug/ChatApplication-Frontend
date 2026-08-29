import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fetchedGroupDetails: [],
  selectedGroupIndex: null,
  refetchingFlag: true,
  recentMessageObject: {
    groupID: null,
    messageObject: null,
  },
};
const fetchedGroupDetailsSlice = createSlice({
  name: "fetchedGroupDetails",
  initialState: initialState,
  reducers: {
    updatingChatDetails(state, action) {
      const index = state.fetchedGroupDetails.findIndex(
        (element) => element.groupId === action.payload.groupID,
      );
      if (index === -1) {
        console.group("Something went wrong:");
        return;
      }
      state.fetchedGroupDetails[index].lastMessage =
        action.payload.recentMessageContent;
      if (
        action.payload.messageObjectLength !== null &&
        state.selectedGroupIndex !== index
      ) {
        state.fetchedGroupDetails[index].unseenMessageCounter =
          state.fetchedGroupDetails[index].unseenMessageCounter +
          action.payload.messageObjectLength;
      }
      if (state.selectedGroupIndex === index) {
        state.fetchedGroupDetails[index].lastCheckedMessageID =
          action.payload.recentMessageid;
      }
      const updatedGroupChatDetails = state.fetchedGroupDetails;
      const updatedValues = updatedGroupChatDetails[index];
      updatedGroupChatDetails.splice(index, 1);
      updatedGroupChatDetails.unshift(updatedValues);
      state.fetchedGroupDetails = updatedGroupChatDetails;
      const isViewingTheGroup = state.selectedGroupIndex === index;
      const originalSelectedIndex = state.selectedGroupIndex;
      if (action.payload.messageObjectLength === null || isViewingTheGroup) {
        state.selectedGroupIndex = 0;
      } else if (originalSelectedIndex < index) {
        state.selectedGroupIndex = originalSelectedIndex + 1;
      }
    },
    initializeGroupChatDetails(state, action) {
      state.fetchedGroupDetails = action.payload;
    },
    setSelectedGroupIndex(state, action) {
      state.selectedGroupIndex = action.payload;
    },
    setRefetchingFlag(state, action) {
      state.refetchingFlag = action.payload;
    },
    deletingUserFromFetchedGroupDetails(state, action) {
      state.fetchedGroupDetails = state.fetchedGroupDetails.filter(
        (value) => value.groupId !== action.payload,
      );
      state.selectedGroupIndex = 0;
    },
    updatingRecentMessage(state, action) {
      state.recentMessageObject.groupID = action.payload.groupID;
      state.recentMessageObject.messageObject = action.payload.messageObject;
    },
    resettingRecentMessage(state) {
      state.recentMessageObject.groupID = null;
      state.recentMessageObject.messageObject = null;
    },
    updatingTheUnCheckedMessageCountTo0(state, action) {
      state.fetchedGroupDetails[action.payload].unseenMessageCounter = 0;
    },

    updatingLastCheckedMessageInGroupInfo(state, action) {
      const index = state.fetchedGroupDetails.findIndex(
        (element) => element.groupId === action.payload.groupId,
      );
      if (index === -1) return;
      const messageObject = action.payload.messageObject;
      state.fetchedGroupDetails[index].lastCheckedMessageID =
        messageObject.messageID;
    },
    logout(state) {
      state.fetchedGroupDetails = initialState.fetchedGroupDetails;
      state.recentMessageObject = initialState.recentMessageObject;
      state.refetchingFlag = initialState.refetchingFlag;
      state.selectedGroupIndex = initialState.selectedGroupIndex;
    },
  },
});
export const fetchedGroupDetailsReducer = fetchedGroupDetailsSlice.reducer;
export const fetchedGroupDetailsSliceActions = fetchedGroupDetailsSlice.actions;
