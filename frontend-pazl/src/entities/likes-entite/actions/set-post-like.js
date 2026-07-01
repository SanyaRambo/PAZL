import { ACTION_TYPE } from '../action-type';

export const setPostLike = (postId, data) => ({
	type: ACTION_TYPE.SET_POST_LIKE,
	payload: { postId, data },
});
