import { useOutletContext } from 'react-router-dom';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../../../../entities/user-entite/selectors';
import { selectUserId } from '../../../../../entities/user-entite/selectors';
import { UserItem } from './UserItem';
import styles from '../usersList.module.css';
import { OctagonX } from 'lucide-react';

export const FriendsList = memo(() => {
	const { filteredRoles, friends, following, inputValue } = useOutletContext();
	const currentUserId = useSelector(selectUserId);
	const currentUserIdRole = useSelector(selectUserRole);

	const filteredFriends = useMemo(() => {
		const search = inputValue.toLowerCase();
		return friends.filter((user) => user.login.toLowerCase().includes(search));
	}, [friends, inputValue]);

	if (filteredFriends.length === 0) {
		return (
			<div
				className={styles.empty}
				style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
			>
				{inputValue ? (
					<>
						<div
					style={{
						fontSize: '30px',
					}}
				>
					Таких друзей не найдено
				</div>
				<OctagonX
					size={60}
					style={{
						color: '#ec5959',
					}}
				/>
					</>
				) : (
					<div
					style={{
							fontSize: '30px',
						}}
					>
					У вас нет друзей. Найдите друга!
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={styles.listContainer}>
			{filteredFriends.map((user) => {
				const isFollowing = following.some((f) => f.id === user.id);
				return (
					<UserItem
						key={user.id}
						user={user}
						currentUserId={currentUserId}
						currentUserIdRole={currentUserIdRole}
						isFriend={true}
						isFollowing={isFollowing}
						hasIncomingRequest={false}
						hasOutgoingRequest={false}
						roles={filteredRoles}
					/>
				);
			})}
		</div>
	);
});
