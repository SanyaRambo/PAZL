import { ACTION_TYPE } from '../action-type';
import { request } from '../../../shared/utils/request'
export const logout = () => {
	request('/api/logout', 'POST');
	return { type: ACTION_TYPE.LOGOUT };
};
