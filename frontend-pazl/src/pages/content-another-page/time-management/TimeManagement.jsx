import { useRequestServer } from '../../../shared/hooks';
import { StatsDashboard } from './components';
import { PostsStatsTable } from './components';
import { TaskPlanner } from './components';
import { Clock } from 'lucide-react';
import styles from './timeManagement.module.css';

export const TimeManagement = () => {
	const {
		data: statsData,
		loading: statsLoading,
		error: statsError,
	} = useRequestServer('/api/user-stats/stats', 'GET');

	const stats = statsData || null;

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<h1 className={styles.title}>
					<Clock
						size={28}
						style={{
							color: '40c057',
						}}
					/>{' '}
					Тайм-менеджмент
				</h1>
				<p className={styles.subtitle}>Статистика и планирование</p>
			</div>

			{statsLoading && <div className={styles.loader}>Загрузка статистики...</div>}
			{statsError && <div className={styles.error}>Ошибка загрузки статистики</div>}

			{stats && (
				<>
					<StatsDashboard stats={stats} />
					<PostsStatsTable postsStats={stats.postsStats} />
					<div className={styles.plannerWrapper}>
						<TaskPlanner />
					</div>
				</>
			)}
		</div>
	);
};
