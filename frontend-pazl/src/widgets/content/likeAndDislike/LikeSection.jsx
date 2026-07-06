import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LikeButtons } from './LikeButtons';
import {
	selectPostLike,
	selectCommentLike,
} from '../../../entities/likes-entite/selectors';
import { updateLikeThunk } from '../../../entities/likes-entite/actions';

export const LikeSection = memo(({ entityId, idPublication, isComment = false }) => {
	const dispatch = useDispatch();
	const likeData = useSelector((state) =>
		isComment ? selectCommentLike(state, entityId) : selectPostLike(state, entityId),
	);

	const likesCount = likeData?.likesCount ?? 0;
	const dislikesCount = likeData?.dislikesCount ?? 0;
	const isLiked = likeData?.isLiked ?? false;
	const isDisliked = likeData?.isDisliked ?? false;

	const handleLike = useCallback(
		(e) => {
			e.stopPropagation();
			e.preventDefault();
			dispatch(updateLikeThunk(idPublication, isComment ? entityId : null, 'like'));
		},
		[dispatch, idPublication, isComment, entityId],
	);

	const handleDislike = useCallback(
		(e) => {
			e.stopPropagation();
			e.preventDefault();
			dispatch(
				updateLikeThunk(idPublication, isComment ? entityId : null, 'dislike'),
			);
		},
		[dispatch, idPublication, isComment, entityId],
	);

	return (
		<LikeButtons
			likesCount={likesCount}
			dislikesCount={dislikesCount}
			isLiked={isLiked}
			isDisliked={isDisliked}
			onLike={handleLike}
			onDislike={handleDislike}
		/>
	);
});
