import { ACTION_TYPE } from "../action-type";

export const setEditingPost = (post) => ({
	type: ACTION_TYPE.SET_EDITING_POST,
	payload: post,
});
