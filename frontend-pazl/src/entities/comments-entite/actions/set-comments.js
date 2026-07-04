import { ACTION_TYPE } from '../action-type';

export const setComments = (comments) => ({
	type: ACTION_TYPE.SET_COMMENTS,
	payload: comments,
});
