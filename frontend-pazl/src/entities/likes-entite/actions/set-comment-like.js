import { ACTION_TYPE } from '../action-type';

export const setCommentLike = (commentId, data) => ({
	type: ACTION_TYPE.SET_COMMENT_LIKE,
	payload: { commentId, data },
});
