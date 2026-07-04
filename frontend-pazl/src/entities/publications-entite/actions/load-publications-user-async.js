import { setPublicationsUser } from './set-publications-user';
import { setPublicationsLoading } from './set-publications-loading';
import { request } from '../../../shared/utils/request';

export const loadPublicationsUserAsync =
	(params = {}) =>
	async (dispatch) => {
		dispatch(setPublicationsLoading(true));
		try {
			const { sortBy = 'createdAt', order = 'desc', userId, isPublished } = params;
			// ✅ Строим URL с параметрами
			let url = `/api/media-library/publicationsUser/${userId}?sortBy=${sortBy}&order=${order}&limit=1000`;
			if (isPublished !== undefined) {
				url += `&isPublished=${isPublished}`;
			}
			const result = await request(url, 'GET');
			if (result.res) {
				dispatch(setPublicationsUser(result.res.items));
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			dispatch(setPublicationsUser([], error.message));
		} finally {
			dispatch(setPublicationsLoading(false));
		}
	};
