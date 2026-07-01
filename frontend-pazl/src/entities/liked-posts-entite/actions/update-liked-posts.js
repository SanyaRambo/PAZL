import { ACTION_TYPE } from '../action-type';

export const updateLikedPost = (postId, changes) => ({
  type: ACTION_TYPE.UPDATE_LIKED_POST,
  payload: { id: postId, changes },
});
