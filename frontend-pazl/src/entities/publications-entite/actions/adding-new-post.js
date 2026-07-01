import { ACTION_TYPE } from "../action-type";

export const addingNewPost = (newPost) => ({
	type: ACTION_TYPE.ADDING_NEW_POST,
	payload: newPost,
});
