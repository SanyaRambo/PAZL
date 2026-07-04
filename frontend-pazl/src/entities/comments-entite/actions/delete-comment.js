import { ACTION_TYPE } from '../action-type';

export const deleteComment = (commentId) => ({
	type: ACTION_TYPE.DELETE_COMMENT,
	payload: commentId,
});
