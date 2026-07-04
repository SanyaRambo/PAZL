import { ACTION_TYPE } from '../action-type';

export const setCommentsError = (error) => ({
	type: ACTION_TYPE.SET_COMMENTS_ERROR,
	payload: error,
});
