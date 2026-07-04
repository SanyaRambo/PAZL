import { ACTION_TYPE } from '../action-type';

export const setCommentsLoading = (loading) => ({
	type: ACTION_TYPE.SET_COMMENTS_LOADING,
	payload: loading,
});
