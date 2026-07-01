import { ACTION_TYPE } from "../action-type";

const initialEditorState = {
	post: null,
	isDirty: false,
};

export const editorReducer = (state = initialEditorState, action) => {
	const { type, payload } = action;
	switch (type) {
		case ACTION_TYPE.SET_EDITING_POST: {
			return {
				post: payload,
				isDirty: false,
			}
		}
		case ACTION_TYPE.UPDATE_EDITING_POST: {
			if (!state.post) return state;
			return {
				...state,
				post: {...state.post, ...payload},
				isDirty: true,
			}
		}
		case ACTION_TYPE.CLEAR_EDITING_POST: {
			return initialEditorState;
		}
		case ACTION_TYPE.LOGOUT: {
			return initialEditorState;
		}
		default:
			return state
	}
};
