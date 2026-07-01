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
			likesCount={likeData.likesCount}
			dislikesCount={likeData.dislikesCount}
			isLiked={likeData.isLiked}
			isDisliked={likeData.isDisliked}
			onLike={handleLike}
			onDislike={handleDislike}
		/>
	);
};
