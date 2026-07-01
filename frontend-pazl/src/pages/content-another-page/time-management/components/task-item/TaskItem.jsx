import { useState } from 'react';
import styles from './taskItem.module.css';
import { Check, Edit, Trash2, Calendar } from 'lucide-react';
import { request } from '../../../../../shared/utils/request';
import { ConfirmModal } from '../../../../../widgets/modal-window/confirm-modal';

export const TaskItem = ({ task, onEdit, onDelete }) => {
	const { id, title, description, isDone, deadline } = task;
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const toggleDone = async () => {
		try {
			await request(`/api/task/${id}`, 'PATCH', { isDone: !isDone });
			onDelete();
		} catch (err) {
			console.error(err);
		}
	};

	const handleDelete = () => {
		setIsDeleteModalOpen(true);
	};

	const confirmDelete = async () => {
		try {
			await request(`/api/task/${id}`, 'DELETE');
			onDelete();
		} catch (err) {
			console.error(err);
		}
	};

	const deadlineDate = deadline ? new Date(deadline).toLocaleDateString('ru-RU') : null;
	const isOverdue = deadline && new Date(deadline) < new Date() && !isDone;

	return (
		<>
			<div className={`${styles.item} ${isDone ? styles.done : ''}`}>
				<div className={styles.main}>
					<button className={styles.checkButton} onClick={toggleDone}>
						{isDone ? (
							<Check size={18} />
						) : (
							<div className={styles.emptyCircle} />
						)}
					</button>
					<div className={styles.info}>
						<span className={styles.title}>{title}</span>
						{description && (
							<span className={styles.description}>{description}</span>
						)}
					</div>
				</div>
				<div className={styles.actions}>
					{deadline && (
						<span
							className={`${styles.deadline} ${isOverdue ? styles.overdue : ''}`}
						>
							<Calendar size={14} /> {deadlineDate}
						</span>
					)}
					<button className={styles.editBtn} onClick={() => onEdit(task)}>
						<Edit size={16} />
					</button>
					<button className={styles.deleteBtn} onClick={handleDelete}>
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			<ConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDelete}
				title="Удаление задачи"
				message={`Вы действительно хотите удалить задачу "${title}"? Это действие необратимо.`}
				confirmText="Да, удалить"
				cancelText="Отмена"
				variant="danger"
			/>
		</>
	);
};
