import styles from './publicationSkeleton.module.css';

export const PublicationSkeleton = () => (
	<div className={styles.container}>
		<div className={`${styles.skeletonCover} ${styles.skeletonBase}`} />
		<h1 className={`${styles.skeletonTitle} ${styles.skeletonBase}`} />
		<div className={styles.skeletonMeta}>
			<span className={`${styles.skeletonAuthor} ${styles.skeletonBase}`} />
			<span className={`${styles.skeletonDate} ${styles.skeletonBase}`} />
		</div>
		<div className={styles.skeletonContent}>
			<div className={`${styles.skeletonText} ${styles.skeletonBase}`} />
			<div
				className={`${styles.skeletonText} ${styles.skeletonBase}`}
				style={{ width: '90%' }}
			/>
			<div
				className={`${styles.skeletonText} ${styles.skeletonBase}`}
				style={{ width: '85%' }}
			/>
			<div
				className={`${styles.skeletonText} ${styles.skeletonBase}`}
				style={{ width: '95%' }}
			/>
			<div
				className={`${styles.skeletonText} ${styles.skeletonBase}`}
				style={{ width: '75%' }}
			/>
		</div>
	</div>
);
