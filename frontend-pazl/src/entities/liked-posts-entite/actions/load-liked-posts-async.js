import { request } from '../../../shared/utils/request';
import { setLikedPosts } from './set-liked-posts';
import { setLikedPostsLoading } from './set-liked-posts-loading';

export const loadLikedPostsAsync = () => async (dispatch) => {
	dispatch(setLikedPostsLoading(true));
	try {
		const data = await request('/api/media-library/publicationsLiked', 'GET');
		if (data.error) throw new Error(data.error);
		dispatch(setLikedPosts(data.res.items));
	} catch (e) {
		dispatch(setLikedPosts([], e.message));
	} finally {
		dispatch(setLikedPostsLoading(false));
	}
};
