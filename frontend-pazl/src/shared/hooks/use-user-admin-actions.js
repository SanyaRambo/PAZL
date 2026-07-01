import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from './use-mutation';
import { addDeletedUserId } from '../../entities/friends-entite/actions';

export const useUserAdminActions = (userId, onRoleUpdated) => {
	const dispatch = useDispatch(); 
	const [isRoleSaving, setIsRoleSaving] = useState(false);
	const [isRoleSave, setIsRoleSave] = useState(false);
	const [isUserDeleting, setIsUserDeleting] = useState(false);
	const [isUserDelete, setIsUserDelete] = useState(false);
	const [isUserDeleteError, setIsUserDeleteError] = useState(false);

	const { mutate: updateUserRole } = useMutation();
	const { mutate: deleteUser } = useMutation();

	const onRoleSave = async (selectedRole) => {
		try {
			setIsRoleSaving(true);
			const result = await updateUserRole(
				`/api/friends-and-communities/${userId}`,
				'PATCH',
				{ selectedRole },
			);
			if (result.success) {
				setIsRoleSave(true);
				if (onRoleUpdated) onRoleUpdated(userId, selectedRole);
			} else {
				throw new Error(result.error);
			}
		} catch (e) {
			console.error(e);
		} finally {
			setIsRoleSaving(false);
			setTimeout(() => setIsRoleSave(false), 1000);
		}
	};

	const onDeleteUser = async () => {
		setIsUserDeleteError(false);
		try {
			setIsUserDeleting(true);
			const result = await deleteUser(
				`/api/friends-and-communities/${userId}`,
				'DELETE',
			);
			if (result.success) {
				setIsUserDelete(true);

				dispatch(addDeletedUserId(userId));

				return true;
			} else {
				throw new Error(result.error);
			}
		} catch (e) {
			console.error(e);
			setIsUserDeleteError(true);
			return false;
		} finally {
			setIsUserDeleting(false);
			setTimeout(() => {
				setIsUserDelete(false);
				setIsUserDeleteError(false);
			}, 2000);
		}
	};

	return {
		isRoleSaving,
		isRoleSave,
		isUserDeleting,
		isUserDelete,
		isUserDeleteError,
		onRoleSave,
		onDeleteUser,
	};
};
