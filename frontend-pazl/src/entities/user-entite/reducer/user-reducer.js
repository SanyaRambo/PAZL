import { ACTION_TYPE } from '../action-type';
import { ROLE } from '../../../shared/constants';

const initialUserState = {
	id: null,
	avatar: null,
	login: null,
	idRole: ROLE.GUEST,
	registeredAt: null,
	theme: 'dark',
};

export const userReducer = (state = initialUserState, action) => {
	const { type, payload } = action;

	switch (type) {
		case ACTION_TYPE.SET_USER: {
			return {
				...state,
				...payload,
			};
		}
		case ACTION_TYPE.LOGOUT:
			return initialUserState;

		default:
			return state;
	}
};
