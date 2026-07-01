import { ACTION_TYPE } from '../action-type';

const initialState = {
	items: [],
	loading: false,
	error: null,
	loaded: false,
};

export const likedPostsReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_LIKED_POSTS: {
			return {
				items: action.payload.items,
				loading: false,
				error: action.payload.error ?? null,
				loaded: true,
			};
		}
		case ACTION_TYPE.SET_LIKED_POSTS_LOADING: {
			return { ...state, loading: action.payload };
		}
		case ACTION_TYPE.UPDATE_LIKED_POST: {

			return {
				...state,
				items: state.items.map((post) =>
					post.id === action.payload.id
						? { ...post, ...action.payload.changes }
						: post,
				),
			};
		}
		case ACTION_TYPE.DELETE_LIKED_POST: {
			return {
				...state,
				items: state.items.filter((post) => post.id !== action.payload.id)
			}
		}
		case ACTION_TYPE.LOGOUT: {
			return initialState;
		}
		default:
			return state;
	}
};
