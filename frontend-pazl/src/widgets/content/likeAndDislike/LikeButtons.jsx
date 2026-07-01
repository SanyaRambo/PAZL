import { ThumbsDownIcon, ThumbsUp } from 'lucide-react';
import styles from './likeButtons.module.css';

export const LikeButtons = ({
	likesCount,
	dislikesCount,
	isLiked,
	isDisliked,
	onLike,
	onDislike,
}) => {
	return (
		<div className={styles.likeAndDislike}>
			<button
				type="button"
				onClick={onLike}
				className={`${styles.likeButton} ${isLiked ? styles.active : ''}`}
				aria-label={`Лайк, количество: ${likesCount}`}
			>
				<ThumbsUp size={18} /> {likesCount}
			</button>
			<span style={{
				color: '#454545'
			}}>
			|
			</span>
			<button
				type="button"
				onClick={onDislike}
				className={`${styles.dislikeButton} ${isDisliked ? styles.active : ''}`}
				aria-label={`Дизлайк, количество: ${dislikesCount}`}
			>
				{dislikesCount} <ThumbsDownIcon size={18} />
			</button>
		</div>
	);
};
