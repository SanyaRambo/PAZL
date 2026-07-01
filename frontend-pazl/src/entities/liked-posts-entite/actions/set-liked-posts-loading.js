import { ACTION_TYPE } from '../action-type';

export const setLikedPostsLoading = (loading) => ({
	type: ACTION_TYPE.SET_LIKED_POSTS_LOADING,
	payload: loading,
});
