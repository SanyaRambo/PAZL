import styles from '../profilePage.module.css';

export const ProfileStats = ({
	postsCount,
	friendsCount,
	followersCount,
	followingCount,
}) => {
	return (
		<div className={styles.stats}>
			<div className={styles.statItem}>
				<span className={styles.statValue}>{postsCount || 0}</span>
				<span className={styles.statLabel}>Публикаций</span>
			</div>
			<div className={styles.statItem}>
				<span className={styles.statValue}>{friendsCount}</span>
				<span className={styles.statLabel}>Друзей</span>
			</div>
			<div className={styles.statItem}>
				<span className={styles.statValue}>{followersCount}</span>
				<span className={styles.statLabel}>Подписчиков</span>
			</div>
			<div className={styles.statItem}>
				<span className={styles.statValue}>{followingCount}</span>
				<span className={styles.statLabel}>Подписок</span>
			</div>
		</div>
	);
};
