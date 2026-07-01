import { ACTION_TYPE } from '../action-type';

export const setLikedPosts = (items, error = null) => ({
	type: ACTION_TYPE.SET_LIKED_POSTS,
	payload: { items, error },
});
