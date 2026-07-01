import { ACTION_TYPE } from '../action-type';

const initialPublicationsUserState = {
	items: [],
	loading: false,
	error: null,
	loaded: false,
};

export const publicationsUserReducer = (state = initialPublicationsUserState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ACTION_TYPE.SET_PUBLICATIONS_USER: {
			return {
				items: payload.items,
				loading: false,
				error: payload.error ?? null,
				loaded: payload.error ? false : true,
			};
		}
		case ACTION_TYPE.SET_PUBLICATIONS_LOADING: {
			return {
				...state,
				loading: payload,
			};
		}
		case ACTION_TYPE.ADDING_NEW_POST: {
			return {
				...state,
				items: [payload, ...state.items],
			};
		}
		case ACTION_TYPE.DELETE_POST: {
			return {
				...state,
				items: state.items.filter((post) => post.id !== payload),
			};
		}
		case ACTION_TYPE.UPDATE_POST_IN_LIST:
			return {
				...state,
				items: state.items.map((post) =>
					post.id === payload.id ? { ...post, ...payload.changes } : post,
				),
			};
		case ACTION_TYPE.LOGOUT: {
			return initialPublicationsUserState;
		}

		default:
			return state;
	}
};
