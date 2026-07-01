import styles from './serverStatus.module.css';

export const Error = (error) => {


	return (
		<div>
			<div className={styles.error}>
				ОШИБКА ЗАГРУЗКИ: {error.error || 'СТРАНИЦА НЕ НАЙДЕНА'}
			</div>
		</div>
	);
};
