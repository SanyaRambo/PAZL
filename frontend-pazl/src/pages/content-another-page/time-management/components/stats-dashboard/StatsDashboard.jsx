import styles from './statsDashboard.module.css';
import {
	FileText,
	Eye,
	MessageCircle,
	CheckSquare,
	Clock,
	TrendingUp,
	Calendar,
	ThumbsUp,
	ThumbsDown,
} from 'lucide-react';

export const StatsDashboard = ({ stats }) => {
	if (!stats) return null;
	const { posts, likes, tasks, lastActivity } = stats;

	const formatDate = (date) => {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const donePercent = tasks.total ? Math.round((tasks.done / tasks.total) * 100) : 0;

	return (
		<div className={styles.dashboard}>
			<div className={styles.grid}>
				<div className={styles.card}>
					<FileText size={22} className={styles.icon} />
					<div className={styles.value}>{posts.total}</div>
					<div className={styles.label}>Посты</div>
					<div className={styles.sub}>
						Опубл. {posts.published} · Неопуб. {posts.drafts}
					</div>
				</div>

				<div className={styles.card}>
					<Eye size={22} className={styles.icon} />
					<div className={styles.value}>{posts.views}</div>
					<div className={styles.label}>Просмотры</div>
				</div>

				<div className={styles.card}>
					<ThumbsUp size={22} className={styles.icon} />
					<div className={styles.value}>{likes.receivedLikes}</div>
					<div className={styles.label}>Лайков получено</div>
					<div className={styles.sub}>
						<ThumbsDown size={14} /> {likes.receivedDislikes}
					</div>
				</div>

				<div className={styles.card}>
					<CheckSquare size={22} className={styles.icon} />
					<div className={styles.value}>{tasks.total}</div>
					<div className={styles.label}>Задачи</div>
					<div className={styles.sub}>
						Выполн. {tasks.done} · Просроч. {tasks.overdue}
					</div>
					<div className={styles.progress}>
						<div
							className={styles.progressFill}
							style={{ width: `${donePercent}%` }}
						/>
					</div>
				</div>

				<div className={styles.card}>
					<Clock size={22} className={styles.icon} />
					<div className={styles.value}>{formatDate(lastActivity)}</div>
					<div className={styles.label}>Последняя активность</div>
				</div>

				<div className={styles.card}>
					<TrendingUp size={22} className={styles.icon} />
					<div className={styles.value}>{likes.likesGiven}</div>
					<div className={styles.label}>Лайков поставлено</div>
					<div className={styles.sub}>
						<ThumbsDown size={14} /> {likes.dislikesGiven}
					</div>
				</div>

				<div className={styles.card}>
					<MessageCircle size={22} className={styles.icon} />
					<div className={styles.value}>{posts.totalComments}</div>
					<div className={styles.label}>Комментариев на постах</div>
				</div>
			</div>
		</div>
	);
};
