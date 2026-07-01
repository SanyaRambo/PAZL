import { ACTION_TYPE } from '../action-type';

const initialState = {
	friends: [],
	following: [],
	requests: [],
	sent: [],
	loading: false,
	error: null,
	deletedUserIds: [],
};

export const friendsReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_FRIENDS_DATA: {
			return {
				...state,
				friends: action.payload.friends,
				following: action.payload.following,
				requests: action.payload.requests,
				sent: action.payload.sent,
				error: null,
			};
		}
		case ACTION_TYPE.SET_FRIENDS_LOADING: {
			return { ...state, loading: action.payload };
		}
		case ACTION_TYPE.SET_FRIENDS_ERROR: {
			return { ...state, error: action.payload };
		}
		case ACTION_TYPE.ADD_DELETED_USER_ID:
			return {
				...state,
				deletedUserIds: [...state.deletedUserIds, action.payload],
			};
		case ACTION_TYPE.CLEAR_DELETED_USERS:
			return {
				...state,
				deletedUserIds: [],
			};
		default:
			return state;
	}
};
