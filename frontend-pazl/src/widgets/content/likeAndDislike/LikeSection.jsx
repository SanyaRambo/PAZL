import { useDispatch, useSelector } from 'react-redux';
import { LikeButtons } from './LikeButtons';
import {
	selectPostLike,
	selectCommentLike,
} from '../../../entities/likes-entite/selectors';
import { updateLikeThunk } from '../../../entities/likes-entite/actions';

export const LikeSection = ({ entityId, idPublication, isComment = false }) => {
	const dispatch = useDispatch();

	const likeData = useSelector((state) =>
		isComment ? selectCommentLike(state, entityId) : selectPostLike(state, entityId),
	);

	const likesCount = likeData?.likesCount ?? 0;
	const dislikesCount = likeData?.dislikesCount ?? 0;
	const isLiked = likeData?.isLiked ?? false;
	const isDisliked = likeData?.isDisliked ?? false;

	const handleLike = (e) => {
		e.stopPropagation();
		e.preventDefault();
		dispatch(updateLikeThunk(idPublication, isComment ? entityId : null, 'like'));
	};

	const handleDislike = (e) => {
		e.stopPropagation();
		e.preventDefault();
		dispatch(updateLikeThunk(idPublication, isComment ? entityId : null, 'dislike'));
	};


	return (
		<LikeButtons
			key={`${entityId}-${isLiked}-${likesCount}`}
			likesCount={likesCount}
			dislikesCount={dislikesCount}
			isLiked={isLiked}
			isDisliked={isDisliked}
			onLike={handleLike}
			onDislike={handleDislike}
		/>
	);
};
