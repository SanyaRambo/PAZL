import { request } from '../../../shared/utils/request';
import { setComments } from './set-comments';
import { setCommentsLoading } from './set-comments-loading';
import { setCommentsError } from './set-comments-error';

export const loadComments =
	(postId, sortBy = 'publishedAt', order = 'asc') =>
	async (dispatch) => {
		dispatch(setCommentsLoading(true));
		try {
			const result = await request(
				`/api/publications/${postId}/comments?sortBy=${sortBy}&order=${order}`,
				'GET',
			);
			if (result.res) {
				dispatch(setComments(result.res));
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			dispatch(setCommentsError(error.message));
		} finally {
			dispatch(setCommentsLoading(false));
		}
	};
