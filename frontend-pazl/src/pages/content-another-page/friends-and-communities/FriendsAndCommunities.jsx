import { useSelector, useDispatch } from 'react-redux';
import styles from './friendsAndCommunities.module.css';
import { selectUserRole } from '../../../entities/user-entite/selectors';
import { ROLE } from '../../../shared/constants';
import { useRequestServer } from '../../../shared/hooks';
import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useRef, useMemo } from 'react';
import { fetchFriendsData } from '../../../entities/friends-entite/actions';
import {
	selectFriends,
	selectFollowing,
	selectRequests,
	selectSent,
} from '../../../entities/friends-entite/selectors';

export const FriendsAndCommunities = ({ inputValue }) => {
	const dispatch = useDispatch();
	const scrollContainerRef = useRef(null);
	const currentUserRole = useSelector(selectUserRole);

	const { data: roles } = useRequestServer(
		'/api/friends-and-communities/roles',
		'GET',
		null,
		currentUserRole,
	);

	const friends = useSelector(selectFriends);
	const following = useSelector(selectFollowing);
	const requests = useSelector(selectRequests);
	const sent = useSelector(selectSent);

	useEffect(() => {
		dispatch(fetchFriendsData());
	}, [dispatch]);

	const filteredRoles = useMemo(() => {
		return (
			roles?.filter((role) => role.id !== ROLE.GUEST && role.id !== ROLE.ADMIN) ||
			[]
		);
	}, [roles]);

	return (
		<div className={styles.FAC}>
			<div className={styles.usersTable} ref={scrollContainerRef}>
				<Outlet
					context={{
						filteredRoles,
						inputValue,
						friends,
						following,
						requests,
						sent,
					}}
				/>
			</div>
			<div className={styles.tabs}>
				<NavLink
					to="users-list"
					className={({ isActive }) =>
						isActive ? `${styles.tab} ${styles.active}` : styles.tab
					}
				>
					Пользователи
				</NavLink>
				<NavLink
					to="friends-list"
					className={({ isActive }) =>
						isActive ? `${styles.tab} ${styles.active}` : styles.tab
					}
				>
					Друзья: {friends.length}
				</NavLink>
				<NavLink
					to="subscribes-list"
					className={({ isActive }) =>
						isActive ? `${styles.tab} ${styles.active}` : styles.tab
					}
				>
					Подписки: {following.length}
				</NavLink>
				<NavLink
					to="applications-list"
					className={({ isActive }) =>
						isActive ? `${styles.tab} ${styles.active}` : styles.tab
					}
				>
					Заявки: {requests.length}
				</NavLink>
			</div>
		</div>
	);
};
