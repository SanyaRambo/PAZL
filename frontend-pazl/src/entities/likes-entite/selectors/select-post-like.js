import { createSelector } from 'reselect';

const selectLikesState = (state) => state.likes;

export const selectPostLike = createSelector(
	[selectLikesState, (state, postId) => postId],
	(likesState, postId) => {
		const data = likesState.posts[postId];
		// Возвращаем существующий объект из стора, если он есть
		if (data) return data;
		// Если данных нет — возвращаем один и тот же объект-заглушку (константу)
		return { likesCount: 0, dislikesCount: 0, isLiked: false, isDisliked: false };
	},
);
