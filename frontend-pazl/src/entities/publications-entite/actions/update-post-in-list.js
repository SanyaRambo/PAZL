import { ACTION_TYPE } from '../action-type';

export const updatePostInList = ({ id, changes }) => ({
	type: ACTION_TYPE.UPDATE_POST_IN_LIST,
	payload: { id, changes },
});
