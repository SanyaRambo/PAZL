import { setPublicationsUser } from './set-publications-user';
import { setPublicationsLoading } from './set-publications-loading';
import { request } from '../../../shared/utils/request';

export const loadPublicationsUserAsync = () => async (dispatch) => {
	await dispatch(setPublicationsLoading(true));
	try {
		const data = await request(
			`/api/workshop/publicationsUser`,
			'GET',
		);


		if (data.error) throw new Error(data.error);



		await dispatch(setPublicationsUser(data.res.items));
	} catch (e) {
		await dispatch(setPublicationsUser([], e.message));
	} finally {
		dispatch(setPublicationsLoading(false));
	}
};
