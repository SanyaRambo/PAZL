import { createSelector } from 'reselect';

const selectCommentsState = (state) =>
	state.comments || { byPostId: {}, loading: false, error: null };

export const selectComments = createSelector(
	[selectCommentsState, (state, postId) => postId],
	(commentsState, postId) => commentsState.byPostId[postId] || [],
);

export const selectCommentsLoading = createSelector(
	[selectCommentsState],
	(commentsState) => commentsState.loading || false,
);

export const selectCommentsError = createSelector(
	[selectCommentsState],
	(commentsState) => commentsState.error || null,
);
