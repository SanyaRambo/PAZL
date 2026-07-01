import { useState } from 'react';
import { useSelector } from 'react-redux'; // ✅ добавить
import { selectDeletedUserIds } from '../../../../../entities/friends-entite/selectors'; // ✅ добавить
import { UsersListLayout } from './UsersListLayout';
import { useFriendActions } from '../../../../../shared/hooks';
import { useUserAdminActions } from '../../../../../shared/hooks';
import { ConfirmModal } from '../../../../../widgets/modal-window/confirm-modal';
import styles from '../usersList.module.css';
import { OctagonX } from 'lucide-react';

export const UserItem = ({
	user,
	currentUserId,
	currentUserIdRole,
	isFriend,
	isFollowing,
	hasIncomingRequest,
	hasOutgoingRequest,
	roles,
	onRoleUpdated,
}) => {
	const friendActions = useFriendActions(user.id);
	const adminActions = useUserAdminActions(user.id, onRoleUpdated);
	const deletedUserIds = useSelector(selectDeletedUserIds); // ✅ получаем список удалённых

	const [selectedRole, setSelectedRole] = useState(user.idRole);
	const [initialRoleId] = useState(user.idRole);
	const isSelectDisabledRole = selectedRole !== initialRoleId;
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleRoleSave = () => adminActions.onRoleSave(selectedRole);

	const handleDeleteUser = () => {
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		await adminActions.onDeleteUser(); // внутри диспатчит addDeletedUserId
		setShowDeleteModal(false);
	};

	// ✅ Проверяем: удалён ли пользователь из глобального списка или пришёл с isDeleted: true
	const isUserDeleted = user.isDeleted || deletedUserIds.includes(user.id);

	if (isUserDeleted) {
		return (
			<div className={`${styles.userItem} ${styles.userItemDeleted}`}>
				<div className={styles.deletedMessage}>
					<span>
						<OctagonX /> ЭТОТ ПОЛЬЗОВАТЕЛЬ УДАЛЁН
					</span>
				</div>
			</div>
		);
	}

	return (
		<>
			<UsersListLayout
				login={user.login}
				registeredAt={user.registeredAt}
				avatar={user.avatar}
				id={user.id}
				idRole={user.idRole}
				currentUserId={currentUserId}
				currentUserIdRole={currentUserIdRole}
				isFriend={isFriend}
				isFollowing={isFollowing}
				hasIncomingRequest={hasIncomingRequest}
				hasOutgoingRequest={hasOutgoingRequest}
				roles={roles}
				isDeleted={false} // обработали выше, всегда false
				follow={friendActions.follow}
				unfollow={friendActions.unfollow}
				sendRequest={friendActions.sendRequest}
				cancelRequest={friendActions.cancelRequest}
				acceptRequest={friendActions.acceptRequest}
				rejectRequest={friendActions.rejectRequest}
				removeFriend={friendActions.removeFriend}
				selectedRole={selectedRole}
				isSelectDisabledRole={isSelectDisabledRole}
				isRoleSaving={adminActions.isRoleSaving}
				isRoleSave={adminActions.isRoleSave}
				onRoleChange={setSelectedRole}
				onRoleSave={handleRoleSave}
				isUserDeleting={adminActions.isUserDeleting}
				isUserDelete={adminActions.isUserDelete}
				isUserDeleteError={adminActions.isUserDeleteError}
				onDeleteUser={handleDeleteUser}
			/>

			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={confirmDelete}
				title="Удаление пользователя"
				message={`Вы действительно хотите удалить пользователя "${user.login}"? Это действие необратимо.`}
				confirmText="Да, удалить"
				cancelText="Отмена"
				variant="danger"
			/>
		</>
	);
};
