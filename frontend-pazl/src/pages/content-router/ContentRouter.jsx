import styles from './contentRouter.module.css';
import { Routes, Route } from 'react-router-dom';
import {
	MainPage,
	Authorization,
	Registration,
	Workshop,
	MediaLibrary,
	TimeManagement,
	Publications,
	Publication,
	Options,
	ProfilePage,
	FriendsAndCommunities,
} from '../content-another-page';
import {
	UsersList,
	SubscribesList,
	ApplicationsList,
	FriendsList,
} from '../content-another-page/friends-and-communities/components';
import { Error as ErrorComponent } from '../../widgets/server-status';
import { useLayoutEffect, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../entities/user-entite/actions';
import { TopHeader } from '../../widgets/top-header';

export const ContentRouter = () => {
	const dispatch = useDispatch();

	const [inputValue, setInputValue] = useState('');
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(inputValue.trim());
		}, 600);
		return () => clearTimeout(handler);
	}, [inputValue]);

	useLayoutEffect(() => {
		fetch('/api/me', { credentials: 'include' })
			.then((res) => {
				if (!res.ok) {
					throw new Error('Not authorized');
				};
				return res.json();
			})
			.then((data) => {
				if (data.user) {
					dispatch(setUser(data.user))
					const theme = data.user.theme || 'dark';
					document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
				};
			})
			.catch(() => {});
	}, [dispatch]);

	return (
		<>
			<TopHeader inputValue={inputValue} setInputValue={setInputValue} />
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/media-library" element={<MediaLibrary />} />
					<Route path="/workshop" element={<Workshop />} />
					<Route path="/login" element={<Authorization />} />
					<Route path="/register" element={<Registration />} />
					<Route path="/time-management" element={<TimeManagement />} />
					<Route
						path="/publications"
						element={<Publications inputValue={debouncedSearchTerm} />}
					/>
					<Route path="/publications/:id" element={<Publication />} />
					<Route path="/options" element={<Options />} />
					<Route path="/profile-user/:userId" element={<ProfilePage />} />
					<Route
						path="/friends-and-communities"
						element={
							<FriendsAndCommunities inputValue={debouncedSearchTerm} />
						}
					>
						<Route index element={<UsersList />} />
						<Route path="users-list" element={<UsersList />} />
						<Route path="friends-list" element={<FriendsList />} />
						<Route path="applications-list" element={<ApplicationsList />} />
						<Route path="subscribes-list" element={<SubscribesList />} />
					</Route>
					<Route path="*" element={<ErrorComponent />} />
				</Routes>
		</>
	);
};
