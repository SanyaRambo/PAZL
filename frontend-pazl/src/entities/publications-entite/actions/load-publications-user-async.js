import { setPublicationsUser } from './set-publications-user';
import { setPublicationsLoading } from './set-publications-loading';
import { request } from '../../../shared/utils/request';

export const loadPublicationsUserAsync =
	(params = {}) =>
	async (dispatch) => {
		dispatch(setPublicationsLoading(true));
		try {
			const { sortBy = 'createdAt', order = 'desc' } = params;
			const result = await request(
				`/api/media-library/publicationsUser?sortBy=${sortBy}&order=${order}`,
				'GET',
			);
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
	
