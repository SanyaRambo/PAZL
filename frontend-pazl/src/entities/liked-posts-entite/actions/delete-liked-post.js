import { ACTION_TYPE } from "../action-type";

export const deleteLikedPost = (selectedPostId) => ({
	type: ACTION_TYPE.DELETE_LIKED_POST,
	payload: {id: selectedPostId},
});
