import styles from '../usersList.module.css';
import { Button } from '../../../../../shared/ui-kit/button';
import { Loader } from '../../../../../widgets/server-status';
import { Select } from '../../../../../shared/ui-kit/select/Select';
import {
	MessageCircle,
	Save,
	Check,
	Trash2,
	UserPlus,
	UserMinus,
	UserX,
	UserCheck,
	Undo2,
	Plus,
	Minus,
	User2,
	X,
	OctagonX
} from 'lucide-react';
import { getColorById } from '../../../../../shared/utils/getColorById';
import { ROLE } from '../../../../../shared/constants';
import { NavLink } from 'react-router-dom';
import { memo } from 'react';


const safeAction = (action, actionName, userId) => {
	if (!action || typeof action.execute !== 'function') {
		console.warn(
			`[UsersListLayout] Missing or invalid action "${actionName}" for user ${userId}`,
		);
		return { loading: false, success: false, execute: () => {} };
	}
	return action;
};

export const UsersListLayout = memo(
	({
		login,
		registeredAt,
		currentUserId,
		currentUserIdRole,
		avatar,
		id,
		idRole,
		isDeleted,
		isUserDeleteError,
		isFriend,
		isFollowing,
		hasIncomingRequest,
		hasOutgoingRequest,
		roles,
		follow,
		unfollow,
		sendRequest,
		cancelRequest,
		acceptRequest,
		rejectRequest,
		removeFriend,
		selectedRole,
		isSelectDisabledRole,
		isRoleSaving,
		isRoleSave,
		onRoleChange,
		onRoleSave,
		isUserDeleting,
		isUserDelete,
		onDeleteUser,
	}) => {



		if (isDeleted) {
			return (
				<div className={`${styles.userItem} ${styles.userItemDeleted}`}>
					<div className={styles.deletedMessage}>
						<span><OctagonX/>ЭТОТ ПОЛЬЗОВАТЕЛЬ УДАЛЁН</span>
					</div>
				</div>
			);
		}


		const followSafe = safeAction(follow, 'follow', id);
		const unfollowSafe = safeAction(unfollow, 'unfollow', id);
		const sendRequestSafe = safeAction(sendRequest, 'sendRequest', id);
		const cancelRequestSafe = safeAction(cancelRequest, 'cancelRequest', id);
		const acceptRequestSafe = safeAction(acceptRequest, 'acceptRequest', id);
		const rejectRequestSafe = safeAction(rejectRequest, 'rejectRequest', id);
		const removeFriendSafe = safeAction(removeFriend, 'removeFriend', id);

		return (
			<div className={styles.userItem}>
				<div className={styles.profileSection}>
					<NavLink
						to={`/profile-user/${id}`}
						className={styles.profileLink}
						onClick={(e) => e.stopPropagation()}
					>
						{avatar ? (
							<img
								src={avatar}
								alt={login}
								className={styles.avatarWrapper}
							/>
						) : (
							<div
								className={styles.avatarWrapper}
								style={{
									background: `linear-gradient(135deg, ${getColorById(id)}, ${getColorById(id + '1')})`,
								}}
							>
								<User2 size={18} strokeWidth={1.2} />
							</div>
						)}
					</NavLink>
					<div className={styles.infoSection}>
						<span className={styles.userName}>{login}</span>
						<span className={styles.dateText}>{registeredAt}</span>
						{currentUserIdRole === ROLE.ADMIN &&
						id !== currentUserId &&
						idRole !== ROLE.ADMIN ? (
							<Select
								onChange={(e) => onRoleChange(Number(e.target.value))}
								id={id}
								name="role"
								value={selectedRole}
								className={styles.roleSelect}
								arrayValues={roles}
							/>
						) : (
							<span className={styles.roleText}>
								{Object.keys(ROLE)[idRole]}
							</span>
						)}
					</div>
				</div>

				<div className={styles.action}>
					{id !== currentUserId && (
						<>
							<Button
								className={styles.iconComment}
								title="Написать сообщение"
							>
								<MessageCircle className={styles.Icon} size={18} />
							</Button>

							{isFriend ? (
								<Button
									className={styles.iconMinus}
									onClick={removeFriendSafe.execute}
									title="Удалить из друзей"
									disabled={removeFriendSafe.loading}
								>
									{removeFriendSafe.loading ? (
										<Loader
											className={styles.smallLoader}
											childclassName={styles.dot}
										/>
									) : removeFriendSafe.success ? (
										<Check className={styles.successIcon} size={18} />
									) : (
										<UserMinus className={styles.Icon} size={18} />
									)}
								</Button>
							) : (
								<>
									{hasIncomingRequest ? (
										<>
											<Button
												className={styles.iconPlus}
												onClick={acceptRequestSafe.execute}
												title="Принять заявку"
												disabled={acceptRequestSafe.loading}
											>
												{acceptRequestSafe.loading ? (
													<Loader
														className={styles.smallLoader}
														childclassName={styles.dot}
													/>
												) : acceptRequestSafe.success ? (
													<Check
														className={styles.successIcon}
														size={18}
													/>
												) : (
													<UserCheck
														className={styles.Icon}
														size={18}
													/>
												)}
											</Button>
											<Button
												className={styles.iconMinus}
												onClick={rejectRequestSafe.execute}
												title="Отклонить заявку"
												disabled={rejectRequestSafe.loading}
											>
												{rejectRequestSafe.loading ? (
													<Loader
														className={styles.smallLoader}
														childclassName={styles.dot}
													/>
												) : rejectRequestSafe.success ? (
													<Check
														className={styles.successIcon}
														size={18}
													/>
												) : (
													<UserX
														className={styles.Icon}
														size={18}
													/>
												)}
											</Button>
										</>
									) : hasOutgoingRequest ? (
										<Button
											className={styles.iconMinus}
											onClick={cancelRequestSafe.execute}
											title="Отменить заявку"
											disabled={cancelRequestSafe.loading}
										>
											{cancelRequestSafe.loading ? (
												<Loader
													className={styles.smallLoader}
													childclassName={styles.dot}
												/>
											) : cancelRequestSafe.success ? (
												<Check
													className={styles.successIcon}
													size={18}
												/>
											) : (
												<Undo2
													className={styles.Icon}
													size={18}
												/>
											)}
										</Button>
									) : (
										<Button
											className={styles.iconPlus}
											onClick={sendRequestSafe.execute}
											title="Добавить в друзья"
											disabled={sendRequestSafe.loading}
										>
											{sendRequestSafe.loading ? (
												<Loader
													className={styles.smallLoader}
													childclassName={styles.dot}
												/>
											) : sendRequestSafe.success ? (
												<Check
													className={styles.successIcon}
													size={18}
												/>
											) : (
												<UserPlus
													className={styles.Icon}
													size={18}
												/>
											)}
										</Button>
									)}
								</>
							)}

							{isFollowing ? (
								<Button
									className={styles.iconMinus}
									onClick={unfollowSafe.execute}
									title="Отписаться"
									disabled={unfollowSafe.loading}
								>
									{unfollowSafe.loading ? (
										<Loader
											className={styles.smallLoader}
											childclassName={styles.dot}
										/>
									) : unfollowSafe.success ? (
										<Check className={styles.successIcon} size={18} />
									) : (
										<Minus className={styles.Icon} size={18} />
									)}
								</Button>
							) : (
								<Button
									className={styles.iconPlus}
									onClick={followSafe.execute}
									title="Подписаться"
									disabled={followSafe.loading}
								>
									{followSafe.loading ? (
										<Loader
											className={styles.smallLoader}
											childclassName={styles.dot}
										/>
									) : followSafe.success ? (
										<Check className={styles.successIcon} size={18} />
									) : (
										<Plus className={styles.Icon} size={18} />
									)}
								</Button>
							)}

							{currentUserIdRole === ROLE.ADMIN && (
								<>
									<Button
										disabled={isRoleSaving}
										className={
											isSelectDisabledRole
												? styles.iconSave
												: styles.disableIcon
										}
										onClick={onRoleSave}
										title="Сохранить роль"
									>
										{!isRoleSaving ? (
											isRoleSave ? (
												<Check
													className={styles.successIcon}
													size={18}
												/>
											) : (
												<Save className={styles.Icon} size={18} />
											)
										) : (
											<Loader
												className={styles.smallLoader}
												childclassName={styles.dot}
											/>
										)}
									</Button>
									<Button
  disabled={isUserDeleting}
  className={isUserDeleting ? styles.disableIcon : styles.iconDelete}
  onClick={onDeleteUser}
  title="Удалить пользователя"
>
  {isUserDeleting ? (
    <Loader className={styles.smallLoader} childclassName={styles.dot} />
  ) : isUserDelete ? (
    <Check className={styles.successIcon} size={18} />
  ) : isUserDeleteError ? ( // ✅ показываем крестик
    <X className={styles.errorIcon} size={18} />
  ) : (
    <Trash2 className={styles.Icon} size={18} />
  )}
</Button>
								</>
							)}
						</>
					)}
				</div>
			</div>
		);
	},
);
