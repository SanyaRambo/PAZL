import { request } from '../../../shared/utils/request';
import { deletePost, setPublicationsUser } from '../../publications-entite/actions';
import { clearEditingPost } from './clear-editing-post';
import { loadLikedPostsAsync } from '../../liked-posts-entite/actions/load-liked-posts-async';

export const deletePostAsync = (selectedPostId) => async (dispatch) => {
	try {
		const data = await request(`/api/publications/${selectedPostId}`, 'DELETE');
		if (data.res) {
			await dispatch(clearEditingPost());
			await dispatch(deletePost(selectedPostId));
			const { pathname } = window.location;
			if (pathname.match(/^\/publications\/\w+$/)) {
				window.location.href = '/publications';
			}
		}
		if (data.error) throw new Error(data.error);
		dispatch(loadLikedPostsAsync());
	} catch (e) {
		await dispatch(setPublicationsUser(null, e.message));
	}
};
