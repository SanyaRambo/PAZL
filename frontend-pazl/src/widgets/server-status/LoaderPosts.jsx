// loaderPost.jsx
import styles from './loaderPosts.module.css';

export const LoaderPost = () => {
	const posts = Array.from({ length: 12 }, (_, i) => ({ id: i + 1 }));

	return (
		<>
			{posts.map(({ id }) => (
				<div className={styles.postCard} key={id}>
					{/* Превью (картинка) */}
					<div className={styles.thumbnail}></div>

					<div className={styles.cardContent}>
						{/* Шапка с логотипом и заголовком */}
						<div className={styles.headerSection}>
							<div className={styles.logo}></div>
							<div className={styles.skeletonTitle}></div>
						</div>

						{/* Превью текста */}
						<div className={styles.skeletonContentPreview}></div>

						{/* Нижняя часть с автором и датой */}
						<div className={styles.metaInfo}>
							<div className={styles.skeletonAuthor}></div>
							<div className={styles.skeletonDate}></div>
						</div>
					</div>
				</div>
			))}

		</>
	);
};
