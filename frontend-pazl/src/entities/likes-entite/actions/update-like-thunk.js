// src/entities/likes-entite/actions/update-like-thunk.js

import { request } from '../../../shared/utils/request';
import { setPostLike } from './set-post-like';
import { setCommentLike } from './set-comment-like';
import { loadLikedPostsAsync, updateLikedPost } from '../../liked-posts-entite/actions';
import { updatePostInList } from '../../publications-entite/actions';
import { deleteLikedPost } from '../../liked-posts-entite/actions/delete-liked-post';

export const updateLikeThunk = (idPublication, commentId, action) => async (dispatch) => {
	// ✅ Проверка на undefined
	if (!idPublication) {
		console.error('❌ updateLikeThunk: idPublication is undefined!');
		return;
	}

	const url = commentId
		? `/api/publications/${idPublication}/comments/${commentId}/like`
		: `/api/publications/${idPublication}/like`;

	try {
		const response = await request(url, 'PATCH', { action });
		if (response.res) {
			const data = {
				id: response.res.id,
				likesCount: response.res.likesCount,
				dislikesCount: response.res.dislikesCount,
				isLiked: response.res.isLiked,
				isDisliked: response.res.isDisliked,
			};


			if (commentId) {

				dispatch(setCommentLike(commentId, data));
			} else {
				
				dispatch(setPostLike(idPublication, data));
				dispatch(
					updatePostInList({
						id: idPublication,
						changes: {
							likesCount: data.likesCount,
							dislikesCount: data.dislikesCount,
							isLiked: data.isLiked,
							isDisliked: data.isDisliked,
						},
					}),
				);
				dispatch(
					updateLikedPost({
						id: idPublication,
						changes: {
							likesCount: data.likesCount,
							dislikesCount: data.dislikesCount,
							isLiked: data.isLiked,
							isDisliked: data.isDisliked,
						},
					}),
				);
				if (data.isLiked === false && data.id === idPublication) {
					dispatch(deleteLikedPost(idPublication));
				} else if (data.isLiked === true && data.id === idPublication) {
					dispatch(loadLikedPostsAsync());
				}
			}
		}
	} catch (error) {
		console.error('❌ Like error:', error);
	}
};
