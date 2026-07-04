// src/entities/comments-entite/reducer.js

import { ACTION_TYPE } from '../action-type';

const initialState = {
	byPostId: {},
	loading: false,
	error: null,
};

export const commentsReducer = (state = initialState, action) => {
	switch (action.type) {
		case ACTION_TYPE.SET_COMMENTS: {
			const comments = action.payload;
			if (!comments || comments.length === 0) return state;
			const postId = comments[0].idPublication;
			if (!postId) return state;
			return {
				...state,
				byPostId: {
					...state.byPostId,
					[postId]: comments,
				},
				error: null,
			};
		}

		case ACTION_TYPE.ADD_COMMENT: {
			const comment = action.payload;
			const postId = comment.idPublication;
			const current = state.byPostId[postId] || [];
			return {
				...state,
				byPostId: {
					...state.byPostId,
					[postId]: [...current, comment],
				},
			};
		}

		case ACTION_TYPE.UPDATE_COMMENT: {
			const { commentId, changes } = action.payload;
			const newByPostId = {};
			for (const [postId, comments] of Object.entries(state.byPostId)) {
				newByPostId[postId] = comments.map((c) =>
					c.id === commentId ? { ...c, ...changes } : c,
				);
			}
			return { ...state, byPostId: newByPostId };
		}

		case ACTION_TYPE.DELETE_COMMENT: {
			const commentId = action.payload;
			const newByPostId = {};
			for (const [postId, comments] of Object.entries(state.byPostId)) {
				newByPostId[postId] = comments.filter((c) => c.id !== commentId);
			}
			return { ...state, byPostId: newByPostId };
		}

		case ACTION_TYPE.SET_COMMENT_LIKE: {
			const { commentId, data } = action.payload;
			const newByPostId = {};
			for (const [postId, comments] of Object.entries(state.byPostId)) {
				newByPostId[postId] = comments.map((c) =>
					c.id === commentId ? { ...c, ...data } : c,
				);
			}
			return { ...state, byPostId: newByPostId };
		}

		case ACTION_TYPE.SET_COMMENTS_LOADING:
			return { ...state, loading: action.payload };

		case ACTION_TYPE.SET_COMMENTS_ERROR:
			return { ...state, error: action.payload };
		case ACTION_TYPE.LOGOUT: {
			return initialState;
		}
		default:
			return state;
	}
};
