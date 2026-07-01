import { ACTION_TYPE } from "../action-type";

export const updateEditingPost = (changes) => ({
	type: ACTION_TYPE.UPDATE_EDITING_POST,
	payload: changes,
});
