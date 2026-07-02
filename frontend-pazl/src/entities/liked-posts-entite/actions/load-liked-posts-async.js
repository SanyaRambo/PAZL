import { request } from '../../../shared/utils/request';
import { setLikedPosts } from './set-liked-posts';
import { setLikedPostsLoading } from './set-liked-posts-loading';

export const loadLikedPostsAsync =
	(params = {}) =>
	async (dispatch) => {
		dispatch(setLikedPostsLoading(true));
		try {
			const { sortBy = 'likedAt', order = 'desc' } = params;
			const result = await request(
				`/api/media-library/publicationsLiked?sortBy=${sortBy}&order=${order}`,
				'GET',
			);
			if (result.res) {
				dispatch(setLikedPosts(result.res.items));
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			dispatch(setLikedPosts([], error.message));
		} finally {
			dispatch(setLikedPostsLoading(false));
		}
	};
