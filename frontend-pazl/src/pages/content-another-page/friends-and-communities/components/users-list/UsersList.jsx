import { useOutletContext } from 'react-router-dom';
import { memo, useCallback, useEffect } from 'react';
import { usePaginatedData } from '../../../../../shared/hooks';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../../../../entities/user-entite/selectors';
import { selectUserId } from '../../../../../entities/user-entite/selectors';
import { UserItem } from './UserItem';
import { LoaderUsers } from '../../../../../widgets/server-status';
import { useIntersectionObserver } from '../../../../../shared/hooks';
import styles from '../usersList.module.css';
import { OctagonX } from 'lucide-react';

export const UsersList = memo(() => {
	const { filteredRoles, inputValue, friends, following, requests, sent } =
		useOutletContext();
	const currentUserId = useSelector(selectUserId);
	const currentUserIdRole = useSelector(selectUserRole);

	const {
		data: usersData,
		loading,
		error,
		hasMore,
		loadMore,
		refetch,
	} = usePaginatedData('/api/friends-and-communities/users', inputValue, 20);


	useEffect(() => {
		refetch();
	}, [inputValue, refetch]);


	const handleRoleUpdated = useCallback(() => {
		refetch();
	}, [refetch]);


	const loadMoreRef = useIntersectionObserver(
		() => {
			if (hasMore && !loading) {
				loadMore();
			}
		},
		{ rootMargin: '200px 0px', threshold: 0.3 },
	);

	if (error) {
		return <div className={styles.error}>Ошибка загрузки пользователей</div>;
	}

	if (!loading && usersData.length === 0 && inputValue) {
		return (
			<div
				className={styles.empty}
				style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
			>
				<div
					style={{
						fontSize: '30px',
					}}
				>
					Таких пользователей не найдено
				</div>
				<OctagonX
					size={60}
					style={{
						color: '#ec5959',
					}}
				/>
			</div>
		);
	}

	return (
		<div className={styles.listContainer}>
			{usersData.map((user) => {
		
				const isFriend = friends.some((f) => f.id === user.id);
				const isFollowing = following.some((f) => f.id === user.id);
				const hasIncomingRequest = requests.some((r) => r.id === user.id);
				const hasOutgoingRequest = sent.some((s) => s.id === user.id);

				return (
					<UserItem
						key={user.id}
						user={user}
						currentUserId={currentUserId}
						currentUserIdRole={currentUserIdRole}
						isFriend={isFriend}
						isFollowing={isFollowing}
						hasIncomingRequest={hasIncomingRequest}
						hasOutgoingRequest={hasOutgoingRequest}
						roles={filteredRoles}
						onRoleUpdated={handleRoleUpdated}
					/>
				);
			})}
			{loading && <LoaderUsers />}
			{hasMore && !loading && (
				<div ref={loadMoreRef} style={{ height: '1px', marginTop: '20px' }} />
			)}
		</div>
	);
});
