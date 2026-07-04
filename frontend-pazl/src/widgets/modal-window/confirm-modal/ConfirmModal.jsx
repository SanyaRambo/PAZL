import styles from './confirmModal.module.css';
import { X, AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({
	isOpen,
	onClose,
	onConfirm,
	title = 'Подтверждение',
	message = 'Вы уверены, что хотите выполнить это действие?',
	confirmText = 'Да, удалить',
	cancelText = 'Отмена',
	variant = 'danger',
	singleButton = false,
}) => {
	if (!isOpen) return null;

	const handleConfirm = () => {
		if (onConfirm) onConfirm();
		onClose();
	};

	const iconColor =
		variant === 'danger' ? '#fa5252' : variant === 'warning' ? '#fcc419' : '#40c057';

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<button className={styles.closeBtn} onClick={onClose}>
					<X size={20} />
				</button>

				<div className={styles.iconWrapper}>
					<AlertTriangle size={48} strokeWidth={1.5} color={iconColor} />
				</div>

				<h3 className={styles.title}>{title}</h3>
				<p className={styles.message}>{message}</p>

				<div className={styles.buttons}>
					{!singleButton && cancelText && (
						<button className={styles.cancelBtn} onClick={onClose}>
							{cancelText}
						</button>
					)}
					<button
						className={`${styles.confirmBtn} ${variant === 'danger' ? styles.danger : variant === 'warning' ? styles.warning : styles.info}`}
						onClick={handleConfirm}
					>
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};
