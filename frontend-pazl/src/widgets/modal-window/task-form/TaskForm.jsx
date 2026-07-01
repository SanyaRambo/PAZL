import { useState } from 'react';
import { request } from '../../../shared/utils/request';
import styles from './taskForm.module.css';
import { X } from 'lucide-react';

export const TaskForm = ({ task, onSave, onCancel }) => {
	const isEdit = !!task;
	const [title, setTitle] = useState(task?.title || '');
	const [description, setDescription] = useState(task?.description || '');
	const [deadline, setDeadline] = useState(() => {
		if (!task?.deadline) return '';
		try {
			const d = new Date(task.deadline);
			if (isNaN(d.getTime())) return '';
			return d.toISOString().split('T')[0];
		} catch {
			return '';
		}
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const payload = {
				title: title.trim() || 'Новая задача',
				description: description.trim() || null,
				deadline: deadline ? new Date(deadline).toISOString() : null,
			};
			if (isEdit) {
				await request(`/api/task/${task.id}`, 'PATCH', payload);
			} else {
				await request('/api/task', 'POST', payload);
			}
			onSave();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.overlay}>
			<div className={styles.modal}>
				<button className={styles.closeBtn} onClick={onCancel}>
					<X size={20} />
				</button>
				<h3 className={styles.modalTitle}>
					{isEdit ? 'Редактировать задачу' : 'Создать задачу'}
				</h3>
				<form onSubmit={handleSubmit}>
					<div className={styles.field}>
						<label>Название</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Введите название задачи"
							required
						/>
					</div>
					<div className={styles.field}>
						<label>Описание</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Дополнительная информация"
							rows={3}
						/>
					</div>
					<div className={styles.field}>
						<label>Дедлайн</label>
						<input
							type="date"
							value={deadline}
							onChange={(e) => setDeadline(e.target.value)}
						/>
					</div>
					<div className={styles.buttons}>
						<button
							type="button"
							className={styles.cancelBtn}
							onClick={onCancel}
						>
							Отмена
						</button>
						<button
							type="submit"
							className={styles.submitBtn}
							disabled={loading}
						>
							{loading ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
