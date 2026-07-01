import { useState, useCallback } from 'react';

export const useLikeDislike = ({
	initialLikesCount,
	initialDislikesCount,
	initialIsLiked,
	initialIsDisliked,
	commentId = null,
	idPublication,
	updateLike,
}) => {
	const [likeCount, setLikeCount] = useState(initialLikesCount || 0);
	const [dislikeCount, setDislikeCount] = useState(initialDislikesCount || 0);
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [isDisliked, setIsDisliked] = useState(initialIsDisliked);

	

	const handleLike = useCallback(async () => {
		// Сохраняем текущее состояние для отката
		const prevLikeCount = likeCount;
		const prevIsLiked = isLiked;
		const prevDislikeCount = dislikeCount;
		const prevIsDisliked = isDisliked;

		try {
			// Локальное оптимистичное обновление
			if (isLiked) {
				// Убираем лайк
				setLikeCount((prev) => prev - 1);
				setIsLiked(false);
			} else {
				// Ставим лайк, убираем дизлайк если был
				setLikeCount((prev) => (isDisliked ? prev + 1 : prev + 1));
				setDislikeCount((prev) => (isDisliked ? prev - 1 : prev));
				setIsLiked(true);
				setIsDisliked(prevIsDisliked ? false : isDisliked);
			}

			if ( commentId ) {
				const response = await updateLike(
					`/api/publications/${idPublication}/comments/${commentId}/like`,
					'PATCH',
					{ action: isLiked ? 'unlike' : 'like' },
				);
				if (response?.res) {
					// Полная синхронизация с сервером
					setLikeCount(response.res.likesCount);
					setDislikeCount(response.res.dislikesCount);
					setIsLiked(response.res.isLiked);
					setIsDisliked(response.res.isDisliked);
				}
				console.log('commentLike')
			} else {
				const response = await updateLike(
					`/api/publications/${idPublication}/like`,
					'PATCH',
					{ action: isLiked ? 'unlike' : 'like' },
				);
				if (response?.res) {
					// Полная синхронизация с сервером
					setLikeCount(response.res.likesCount);
					setDislikeCount(response.res.dislikesCount);
					setIsLiked(response.res.isLiked);
					setIsDisliked(response.res.isDisliked);
				}
				console.log('postLike')
			}

		} catch (error) {
			console.error('Ошибка при отправке лайка:', error);
			setLikeCount(prevLikeCount);
			setDislikeCount(prevDislikeCount);
			setIsLiked(prevIsLiked);
			setIsDisliked(prevIsDisliked);
		}
	}, [
		isLiked,
		isDisliked,
		likeCount,
		dislikeCount,
		commentId,
		idPublication,
		updateLike,
	]);

	const handleDislike = useCallback(async () => {
		// Сохраняем текущее состояние для отката
		const prevLikeCount = likeCount;
		const prevIsLiked = isLiked;
		const prevDislikeCount = dislikeCount;
		const prevIsDisliked = isDisliked;

		try {
			// Локальное оптимистичное обновление
			if (isDisliked) {
				// Убираем дизлайк
				setDislikeCount((prev) => prev - 1);
				setIsDisliked(false);
			} else {
				// Ставим дизлайк, убираем лайк если был
				setDislikeCount((prev) => (isLiked ? prev + 1 : prev + 1));
				setLikeCount((prev) => (isLiked ? prev - 1 : prev));
				setIsDisliked(true);
				setIsLiked(prevIsLiked ? false : isLiked);
			}

			if ( commentId ) {
				const response = await updateLike(
					`/api/publications/${idPublication}/comments/${commentId}/like`,
					'PATCH',
					{ action: isDisliked ? 'undislike' : 'dislike' },
				);
				if (response?.res) {
					// Полная синхронизация с сервером
					setLikeCount(response.res.likesCount);
					setDislikeCount(response.res.dislikesCount);
					setIsLiked(response.res.isLiked);
					setIsDisliked(response.res.isDisliked);
				}
				console.log('commentDislike')
			} else {
				const response = await updateLike(
					`/api/publications/${idPublication}/like`,
					'PATCH',
					{ action: isDisliked ? 'undislike' : 'dislike' },
				);
				if (response?.res) {
					// Полная синхронизация с сервером
					setLikeCount(response.res.likesCount);
					setDislikeCount(response.res.dislikesCount);
					setIsLiked(response.res.isLiked);
					setIsDisliked(response.res.isDisliked);
				}
				console.log('postDislike')
			}
		} catch (error) {
			console.error('Ошибка при отправке дизлайка:', error);
			// Откат при ошибке
			setLikeCount(prevLikeCount);
			setDislikeCount(prevDislikeCount);
			setIsLiked(prevIsLiked);
			setIsDisliked(prevIsDisliked);
		}
	}, [
		isLiked,
		isDisliked,
		likeCount,
		dislikeCount,
		commentId,
		idPublication,
		updateLike,
	]);

	return {
		likeCount,
		dislikeCount,
		isLiked,
		isDisliked,
		handleLike,
		handleDislike,
	};
};
