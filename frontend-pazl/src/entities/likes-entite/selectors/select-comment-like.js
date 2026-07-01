import { createSelector } from 'reselect';

const selectLikesState = (state) => state.likes;

export const selectCommentLike = createSelector(
	[selectLikesState, (state, commentId) => commentId],
	(likesState, commentId) => {
		const data = likesState.comments[commentId];
		if (data) return data;
		return { likesCount: 0, dislikesCount: 0, isLiked: false, isDisliked: false };
	},
);
