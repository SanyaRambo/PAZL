import { FileX } from 'lucide-react';
import styles from './postCard.module.css';

export const DeletedPostCard = () => {
	return (
		<div
			className={styles.card}
			style={{
				border: '1px solid #c42828',
			}}
		>
			<div
				className={styles.cardImage}
				style={{
					border: '1px solid #c42828',
				}}
			>
				<div className={styles.placeholderImage}>
					<FileX
						size={32}
						style={{
							color: '#c42828',
						}}
					/>
				</div>
			</div>
			<div
				className={styles.cardbody}
				style={{
					textAlign: 'center',
				}}
			>
				<h2
					style={{
						color: '#c42828',
					}}
				>
					ЭТОТ ПОСТ БЫЛ УДАЛЁН
				</h2>
			</div>
		</div>
	);
};
