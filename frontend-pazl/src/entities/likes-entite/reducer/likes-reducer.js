import { ACTION_TYPE } from '../action-type';

const initialLikesState = {
	posts: {},
	comments: {},
};

export const likesReducer = (state = initialLikesState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_POST_LIKE: {
			const { postId, data } = action.payload;
			return {
				...state,
				posts: {
					...state.posts,
					[postId]: data,
				},
			};
		}
		case ACTION_TYPE.SET_COMMENT_LIKE: {
			const { commentId, data } = action.payload;
			return {
				...state,
				comments: {
					...state.comments,
					[commentId]: data,
				},
			};
		}
		case ACTION_TYPE.LOGOUT: {
			return initialLikesState
		}
		default:
			return state;
	}
};
