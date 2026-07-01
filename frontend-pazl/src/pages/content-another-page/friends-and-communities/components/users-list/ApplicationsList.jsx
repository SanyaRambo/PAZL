import { useOutletContext } from 'react-router-dom';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../../../../entities/user-entite/selectors';
import { selectUserId } from '../../../../../entities/user-entite/selectors';
import { UserItem } from './UserItem';
import styles from '../usersList.module.css';
import { OctagonX } from 'lucide-react';

export const ApplicationsList = memo(() => {
	const { filteredRoles, friends, following, requests, inputValue } =
		useOutletContext();
	const currentUserId = useSelector(selectUserId);
	const currentUserIdRole = useSelector(selectUserRole);

	const filteredRequests = useMemo(() => {
		const search = inputValue.toLowerCase();
		return requests.filter((user) => user.login.toLowerCase().includes(search));
	}, [requests, inputValue]);

	if (filteredRequests.length === 0) {
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
							Заявок в друзья от такого пользователя не найдено
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
						У вас нет заявок в друзья
					</div>
				)}
			</div>
		);
	}

	return (
		<div className={styles.listContainer}>
			{filteredRequests.map((user) => {
				const isFriend = friends.some((f) => f.id === user.id);
				const isFollowing = following.some((f) => f.id === user.id);
				return (
					<UserItem
						key={user.id}
						user={user}
						currentUserId={currentUserId}
						currentUserIdRole={currentUserIdRole}
						isFriend={isFriend}
						isFollowing={isFollowing}
						hasIncomingRequest={true}
						hasOutgoingRequest={false}
						roles={filteredRoles}
					/>
				);
			})}
		</div>
	);
});
