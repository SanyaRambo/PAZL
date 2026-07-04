import { ACTION_TYPE } from '../action-type';

export const updateComment = (commentId, changes) => ({
	type: ACTION_TYPE.UPDATE_COMMENT,
	payload: { commentId, changes },
});
