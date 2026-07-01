export const selectFriends = (state) => state.friends.friends;
export const selectFollowing = (state) => state.friends.following;
export const selectRequests = (state) => state.friends.requests;
export const selectSent = (state) => state.friends.sent;
export const selectFriendsLoading = (state) => state.friends.loading;
export const selectFriendsError = (state) => state.friends.error;
export const selectDeletedUserIds = (state) => state.friends.deletedUserIds || [];
