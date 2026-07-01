import { ACTION_TYPE } from '../action-type';

export const setPublicationsUser = (items, error = null) => ({
	type: ACTION_TYPE.SET_PUBLICATIONS_USER,
	payload: {items, error},
});
