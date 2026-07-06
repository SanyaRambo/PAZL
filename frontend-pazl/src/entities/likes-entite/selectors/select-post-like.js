import { createSelector } from 'reselect';

const selectLikesState = (state) => state.likes;

export const selectPostLike = createSelector(
	[selectLikesState, (state, postId) => postId],
	(likesState, postId) => {
		const data = likesState.posts[postId];
		if (data) return data;
		return { likesCount: 0, dislikesCount: 0, isLiked: false, isDisliked: false };
	},
);
