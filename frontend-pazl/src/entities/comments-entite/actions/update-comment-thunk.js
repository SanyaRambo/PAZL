import { request } from '../../../shared/utils/request';
import { updateComment } from './update-comment';
import { setCommentsError } from './set-comments-error';

export const updateCommentThunk = (postId, commentId, text) => async (dispatch) => {
	try {
		const result = await request(
			`/api/publications/${postId}/comments/${commentId}`,
			'PATCH',
			{
				commentEdit: text,
			},
		);
		if (result.res) {
			dispatch(updateComment(commentId, result.res));
		} else {
			throw new Error(result.error);
		}
	} catch (error) {
		dispatch(setCommentsError(error.message));
	}
};
