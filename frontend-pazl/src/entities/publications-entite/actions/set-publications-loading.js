import { ACTION_TYPE } from '../action-type';

export const setPublicationsLoading = (loading = false) => ({
	type: ACTION_TYPE.SET_PUBLICATIONS_LOADING,
	payload: loading,
});
