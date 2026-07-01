import { PostCard } from '../../../../widgets/content/post-card';
import { Loader, Error } from '../../../../widgets/server-status';
import styles from '../profilePage.module.css';

export const ProfilePosts = ({ posts, loading, error }) => {
	if (loading) return <Loader />;
	if (error) return <Error error={error} />;
	if (posts.length === 0) {
		return <div className={styles.noPosts}>У пользователя пока нет публикаций</div>;
	}

	return (
		<div className={styles.postsSection}>
			<h2>Публикации</h2>
			<div className={styles.postsGrid}>
				{posts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
			</div>
		</div>
	);
};
