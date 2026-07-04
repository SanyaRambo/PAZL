import { request } from '../../../shared/utils/request';
import { deleteComment } from './delete-comment';
import { setCommentsError } from './set-comments-error';

export const deleteCommentThunk = (postId, commentId) => async (dispatch) => {
	try {
		await request(`/api/publications/${postId}/comments/${commentId}`, 'DELETE');
		dispatch(deleteComment(commentId));
	} catch (error) {
		dispatch(setCommentsError(error.message));
	}
};
