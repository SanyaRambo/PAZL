import { request } from '../../../shared/utils/request';
import { addComment } from './add-comment';
import { setCommentsError } from './set-comments-error';

export const addCommentThunk =
	(postId, text, parentId = null) =>
	async (dispatch) => {
		try {
			const result = await request(`/api/publications/${postId}/comments`, 'POST', {
				text,
				idParent: parentId,
				publishedAt: new Date().toISOString(),
			});
			if (result.res) {
				dispatch(addComment(result.res));
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			dispatch(setCommentsError(error.message));
		}
	};
