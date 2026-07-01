import { useState } from 'react';
import { useRequestServer } from '../../../../../shared/hooks';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { TaskItem } from '../task-item';
import { TaskForm } from '../../../../../widgets/modal-window/task-form';
import { Plus, X, Filter, CalendarIcon } from 'lucide-react';
import styles from './taskPlanner.module.css';

export const TaskPlanner = () => {
	const [selectedDate, setSelectedDate] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [editingTask, setEditingTask] = useState(null);
	const [filterMode, setFilterMode] = useState('all');
	const [refreshKey, setRefreshKey] = useState(0);

	const {
		data: tasksData,
		loading,
		error,
		refetch,
	} = useRequestServer('/api/task', 'GET');

	const tasks = tasksData || [];

	const filteredTasks = tasks.filter((task) => {
		if (filterMode === 'date' && selectedDate) {
			if (!task.deadline) return false;
			try {
				const taskDateObj = new Date(task.deadline);
				if (isNaN(taskDateObj.getTime())) return false;
				const dateStr = selectedDate.toISOString().split('T')[0];
				return taskDateObj.toISOString().split('T')[0] === dateStr;
			} catch {
				return false;
			}
		}
		return true;
	});

	const activeTasks = filteredTasks.filter((t) => !t.isDone);
	const doneTasks = filteredTasks.filter((t) => t.isDone);

	const handleAdd = () => {
		setEditingTask(null);
		setShowForm(true);
	};
	const handleEdit = (task) => {
		setEditingTask(task);
		setShowForm(true);
	};
	const handleSaved = () => {
		setShowForm(false);
		setEditingTask(null);
		refetch();
		setRefreshKey((prev) => prev + 1);
	};
	const handleDeleted = () => {
		refetch();
		setRefreshKey((prev) => prev + 1);
	};

	const tileContent = ({ date, view }) => {
		if (view === 'month') {
			if (!date || isNaN(date.getTime())) return null;

			const dateStr = date.toISOString().split('T')[0];
			const hasTask = tasks.some((t) => {
				if (!t.deadline) return false;
				try {
					const taskDate = new Date(t.deadline);
					if (isNaN(taskDate.getTime())) return false;
					return taskDate.toISOString().split('T')[0] === dateStr;
				} catch {
					return false;
				}
			});
			return hasTask ? <div className={styles.dot} /> : null;
		}
		return null;
	};

	return (
		<div className={styles.planner} key={refreshKey}>
			<div className={styles.header}>
				<h2 className={styles.subtitle}>
					<CalendarIcon
						size={18}
						style={{
							color: '40c057',
						}}
					/>{' '}
					Задачи
				</h2>
				<div className={styles.controls}>
					<button
						className={`${styles.filterBtn} ${filterMode === 'all' ? styles.activeFilter : ''}`}
						onClick={() => setFilterMode('all')}
					>
						Все
					</button>
					<button
						className={`${styles.filterBtn} ${filterMode === 'date' ? styles.activeFilter : ''}`}
						onClick={() => {
							setFilterMode('date');
							if (!selectedDate) setSelectedDate(new Date());
						}}
					>
						По дате
					</button>
					<button className={styles.addButton} onClick={handleAdd}>
						<Plus size={18} /> Добавить
					</button>
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.calendarWrapper}>
					<Calendar
						onChange={setSelectedDate}
						value={selectedDate}
						tileContent={tileContent}
						locale="ru-RU"
						className={styles.calendar}
					/>
					{selectedDate && filterMode === 'date' && (
						<div className={styles.selectedDate}>
							<span>
								{selectedDate.toLocaleDateString('ru-RU', {
									weekday: 'long',
									day: 'numeric',
									month: 'long',
								})}
							</span>
							<button
								className={styles.clearDate}
								onClick={() => {
									setSelectedDate(null);
									setFilterMode('all');
								}}
							>
								<X size={16} />
							</button>
						</div>
					)}
				</div>

				<div className={styles.taskList}>
					{loading && <div className={styles.loader}>Загрузка...</div>}
					{error && <div className={styles.error}>Ошибка</div>}
					{!loading && filteredTasks.length === 0 && (
						<div className={styles.empty}>Нет задач</div>
					)}
					{!loading && filteredTasks.length > 0 && (
						<>
							{activeTasks.length > 0 && (
								<div className={styles.group}>
									<div className={styles.groupTitle}>Активные</div>
									{activeTasks.map((t) => (
										<TaskItem
											key={t.id}
											task={t}
											onEdit={handleEdit}
											onDelete={handleDeleted}
										/>
									))}
								</div>
							)}
							{doneTasks.length > 0 && (
								<div className={styles.group}>
									<div className={styles.groupTitle}>Выполненные</div>
									{doneTasks.map((t) => (
										<TaskItem
											key={t.id}
											task={t}
											onEdit={handleEdit}
											onDelete={handleDeleted}
										/>
									))}
								</div>
							)}
						</>
					)}
				</div>
			</div>

			{showForm && (
				<TaskForm
					task={editingTask}
					onSave={handleSaved}
					onCancel={() => {
						setShowForm(false);
						setEditingTask(null);
					}}
				/>
			)}
		</div>
	);
};
