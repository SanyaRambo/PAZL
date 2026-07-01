import styles from './loaderUsers.module.css';

export const LoaderUsers = () => {
	const elements = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

	return (
		<>
			{elements.map(({ id }) => (
				<div className={styles.userItem} key={id}>
					<div className={styles.profileSection}>
						<div className={styles.skeletonCircle}></div>
						<div className={styles.infoSection}>
							<span
								className={`${styles.skeletonText} ${styles.textLine1}`}
							></span>
							<span
								className={`${styles.skeletonText} ${styles.textLine2}`}
							></span>
						</div>
					</div>

					<div className={styles.action}>
						{[1, 2, 3, 4, 5].map((dotId) => (
							<div
								key={dotId}
								className={styles.skeletonDot}
								style={{ '--delay': dotId }}
							></div>
						))}
					</div>
				</div>
			))}
		</>
	);
};
