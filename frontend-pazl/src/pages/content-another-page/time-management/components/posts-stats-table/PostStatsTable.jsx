import { useNavigate } from 'react-router-dom';
import styles from './postsStatsTable.module.css';
import {
	Eye,
	Edit,
	ThumbsUp,
	ThumbsDown,
	MessageCircle,
	CheckCircle,
	XCircle,
	ChartColumn,
} from 'lucide-react';

export const PostsStatsTable = ({ postsStats }) => {
	const navigate = useNavigate();

	if (!postsStats || postsStats.length === 0) {
		return (
			<div className={styles.empty}>
				<p>Нет постов для отображения статистики</p>
			</div>
		);
	}

	const handleGoToPost = (postId) => {
		navigate(`/publications/${postId}`);
	};

	return (
		<div className={styles.tableWrapper}>
			<h3 className={styles.title}>
				<ChartColumn
					size={15}
					style={{
						color: '40c057',
					}}
				/>{' '}
				Статистика по постам
			</h3>
			<div className={styles.list}>
				{postsStats.map((post) => (
					<div key={post.postId} className={styles.postCard}>
						<div className={styles.postHeader}>
							<span className={styles.postTitle}>
								{post.title || 'Без названия'}
							</span>
							<div className={styles.postActions}>
								<button
									className={styles.actionBtn}
									onClick={() => handleGoToPost(post.postId)}
									title="Перейти к посту"
								>
									<Eye size={16} />
								</button>
								<span className={styles.postStatus}>
									{post.isPublished ? (
										<span className={styles.published}>
											<CheckCircle size={14} /> Опубл.
										</span>
									) : (
										<span className={styles.draft}>
											<XCircle size={14} /> Неопубл.
										</span>
									)}
								</span>
							</div>
						</div>
						<div className={styles.postStats}>
							<span>
								<ThumbsUp size={14} /> {post.likes}
							</span>
							<span>
								<ThumbsDown size={14} /> {post.dislikes}
							</span>
							<span>
								<Eye size={14} /> {post.views}
							</span>
							<span>
								<MessageCircle size={14} /> {post.commentsCount}
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};
