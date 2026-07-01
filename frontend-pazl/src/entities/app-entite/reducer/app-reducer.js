import { ACTION_TYPE } from "../action-type";

const initialAppState = {
	wasLogout: false
};

export const appReducer = (state = initialAppState, action) => {
	const { type } = action;
	switch (type) {
		case ACTION_TYPE.LOGOUT: {
			return {
				...state,
				wasLogout: true,
			}
		}
		default:
			return state
	}
};
