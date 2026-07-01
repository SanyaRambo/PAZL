import { ACTION_TYPE } from "../action-type";

export const deletePost = (selectedPostId) => ({
	type: ACTION_TYPE.DELETE_POST,
	payload: selectedPostId,
});
