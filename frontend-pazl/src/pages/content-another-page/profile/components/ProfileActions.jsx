import { Button } from '../../../../shared/ui-kit/button';
import { Loader } from '../../../../widgets/server-status';
import {
	UserPlus,
	UserMinus,
	UserCheck,
	UserX,
	Undo2,
	Settings,
	LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../profilePage.module.css';

export const ProfileActions = ({
	isOwner,
	isFriend,
	isFollowing,
	hasIncomingRequest,
	hasOutgoingRequest,
	followLoading,
	followSuccess,
	friendLoading,
	friendSuccess,
	onToggleFollow,
	onSendRequest,
	onCancelRequest,
	onAcceptRequest,
	onRejectRequest,
	onRemoveFriend,
	onLogout,
	onGoToSettings,
}) => {
	const navigate = useNavigate();
	if (isOwner) {
		return (
			<div className={styles.ownerActions}>
				<Button
					className={`${styles.actionBtn} ${styles.primary}`}
					onClick={onGoToSettings}
				>
					<Settings size={18} /> Настройки
				</Button>
				<Button className={styles.actionBtn} onClick={() => {
					onLogout();
					navigate('/');
					}}>
					<LogOut size={18} /> Выйти
				</Button>
			</div>
		);
	}

	const renderFriendBlock = () => {
		if (isFriend) {
			return (
				<Button
					className={`${styles.actionBtn} ${styles.primary}`}
					onClick={onRemoveFriend}
					disabled={friendLoading}
				>
					{friendLoading ? (
						<Loader className={styles.smallLoader} />
					) : friendSuccess ? (
						<UserCheck size={18} />
					) : (
						<UserMinus size={18} />
					)}
					{!friendLoading && !friendSuccess && 'Удалить из друзей'}
				</Button>
			);
		}

		if (hasIncomingRequest) {
			return (
				<div className={styles.actionGroup}>
					<Button
						className={`${styles.actionBtn} ${styles.primary}`}
						onClick={onAcceptRequest}
						disabled={friendLoading}
					>
						{friendLoading ? (
							<Loader className={styles.smallLoader} />
						) : (
							<UserCheck size={18} />
						)}
						{!friendLoading && 'Принять'}
					</Button>
					<Button
						className={styles.actionBtn}
						onClick={onRejectRequest}
						disabled={friendLoading}
					>
						{friendLoading ? (
							<Loader className={styles.smallLoader} />
						) : (
							<UserX size={18} />
						)}
						{!friendLoading && 'Отклонить'}
					</Button>
				</div>
			);
		}

		if (hasOutgoingRequest) {
			return (
				<Button
					className={`${styles.actionBtn} ${styles.primary}`}
					onClick={onCancelRequest}
					disabled={friendLoading}
				>
					{friendLoading ? (
						<Loader className={styles.smallLoader} />
					) : (
						<Undo2 size={18} />
					)}
					{!friendLoading && 'Отменить заявку'}
				</Button>
			);
		}

		return (
			<Button
				className={`${styles.actionBtn} ${styles.primary}`}
				onClick={onSendRequest}
				disabled={friendLoading}
			>
				{friendLoading ? (
					<Loader className={styles.smallLoader} />
				) : (
					<UserPlus size={18} />
				)}
				{!friendLoading && 'Добавить в друзья'}
			</Button>
		);
	};

	return (
		<div className={styles.actions}>
			{renderFriendBlock()}
			<Button
				className={`${styles.actionBtn}`}
				onClick={onToggleFollow}
				disabled={followLoading}
			>
				{followLoading ? (
					<Loader className={styles.smallLoader} />
				) : followSuccess ? (
					<UserCheck size={18} />
				) : isFollowing ? (
					<UserMinus size={18} />
				) : (
					<UserPlus size={18} />
				)}
				{!followLoading &&
					!followSuccess &&
					(isFollowing ? 'Отписаться' : 'Подписаться')}
			</Button>
		</div>
	);
};
