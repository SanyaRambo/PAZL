import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { useRequestServer } from '../../../shared/hooks';
import { selectUserId } from '../../../entities/user-entite/selectors';
import {
	selectFriends,
	selectFollowing,
	selectRequests,
	selectSent,
} from '../../../entities/friends-entite/selectors';
import {
	toggleFollow,
	sendFriendRequest,
	cancelFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	removeFriend,
} from '../../../entities/friends-entite/actions';
import { logout } from '../../../entities/app-entite/actions';
import { request } from '../../../shared/utils/request';
import { Loader, Error } from '../../../widgets/server-status';
import { ProfileAvatar, ProfileActions, ProfilePosts } from './components';
import { setPostLike } from '../../../entities/likes-entite/actions';
import { getColorById } from '../../../shared/utils/getColorById';
import styles from './profilePage.module.css';
import { setUser } from '../../../entities/user-entite/actions';

export const ProfilePage = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentUserId = useSelector(selectUserId);
	const fileInputRef = useRef(null);

	const {
		data: profileData,
		loading: profileLoading,
		error: profileError,
	} = useRequestServer(`/api/profile-user/${userId}`, 'GET');

	const {
		data: postsData,
		loading: postsLoading,
		error: postsError,
	} = useRequestServer(
		`/api/profile-user/publicationsUser/${userId}?isPublished=true`,
		'GET',
	);

	const [avatar, setAvatar] = useState(null);
	const [friendsCount, setFriendsCount] = useState(0);
	const [followersCount, setFollowersCount] = useState(0);
	const [followingCount, setFollowingCount] = useState(0);

	useEffect(() => {
		if (profileData) {
			setAvatar(profileData.avatar || null);
			setFriendsCount(profileData.friendsCount || 0);
			setFollowersCount(profileData.followersCount || 0);
			setFollowingCount(profileData.followingCount || 0);
		}
	}, [profileData]);

	useEffect(() => {
		if (postsData && postsData.length > 0) {
			postsData.forEach((post) => {
				dispatch(
					setPostLike(post.id, {
						likesCount: post.likesCount,
						dislikesCount: post.dislikesCount,
						isLiked: post.isLiked,
						isDisliked: post.isDisliked,
					}),
				);
			});
		}
	}, [postsData, dispatch]);

	const friends = useSelector(selectFriends);
	const following = useSelector(selectFollowing);
	const requests = useSelector(selectRequests);
	const sent = useSelector(selectSent);

	const profile = profileData || null;
	const posts = postsData || [];

	const isOwner = currentUserId === userId;
	const isFriend = friends.some((f) => f.id === userId);
	const isFollowing = following.some((f) => f.id === userId);
	const hasIncomingRequest = requests.some((r) => r.id === userId);
	const hasOutgoingRequest = sent.some((s) => s.id === userId);

	const [followLoading, setFollowLoading] = useState(false);
	const [followSuccess, setFollowSuccess] = useState(false);

	const [friendLoading, setFriendLoading] = useState(false);
	const [friendSuccess, setFriendSuccess] = useState(false);

	const updateCounters = (type, delta) => {
		if (type === 'friends') setFriendsCount((prev) => Math.max(0, prev + delta));
		else if (type === 'followers')
			setFollowersCount((prev) => Math.max(0, prev + delta));
		else if (type === 'following')
			setFollowingCount((prev) => Math.max(0, prev + delta));
	};

	const handleToggleFollow = async () => {
		setFollowLoading(true);
		setFollowSuccess(false);
		try {
			await dispatch(toggleFollow(userId));
			setFollowSuccess(true);
			const delta = isFollowing ? -1 : 1;
			updateCounters('following', delta);
			updateCounters('followers', delta);
			setTimeout(() => setFollowSuccess(false), 1000);
		} catch (e) {
			console.error(e);
		} finally {
			setFollowLoading(false);
		}
	};

	const handleSendRequest = async () => {
		setFriendLoading(true);
		setFriendSuccess(false);
		try {
			await dispatch(sendFriendRequest(userId));
			setFriendSuccess(true);
			setTimeout(() => setFriendSuccess(false), 1000);
		} catch (e) {
			console.error(e);
		} finally {
			setFriendLoading(false);
		}
	};

	const handleCancelRequest = async () => {
		setFriendLoading(true);
		setFriendSuccess(false);
		try {
			await dispatch(cancelFriendRequest(userId));
			setFriendSuccess(true);
			setTimeout(() => setFriendSuccess(false), 1000);
		} catch (e) {
			console.error(e);
		} finally {
			setFriendLoading(false);
		}
	};

	const handleAcceptRequest = async () => {
		setFriendLoading(true);
		setFriendSuccess(false);
		try {
			await dispatch(acceptFriendRequest(userId));
			setFriendSuccess(true);
			updateCounters('friends', 1);
			setTimeout(() => setFriendSuccess(false), 1000);
		} catch (e) {
			console.error(e);
		} finally {
			setFriendLoading(false);
		}
	};

	const handleRejectRequest = async () => {
		setFriendLoading(true);
		setFriendSuccess(false);
		try {
			await dispatch(rejectFriendRequest(userId));
			setFriendSuccess(true);
			setTimeout(() => setFriendSuccess(false), 1000);
		} catch (e) {
			console.error(e);
		} finally {
			setFriendLoading(false);
		}
	};

	const handleRemoveFriend = async () => {
		setFriendLoading(true);
		setFriendSuccess(false);
		try {
			await dispatch(removeFriend(userId));
			setFriendSuccess(true);
			updateCounters('friends', -1);
			setTimeout(() => setFriendSuccess(false), 1000);
		} catch (e) {
			console.error(e);
		} finally {
			setFriendLoading(false);
		}
	};

	const handleLogout = () => {
		dispatch(logout());
		document.body.className = 'dark-theme';
		navigate('/');
	};

	const handleGoToSettings = () => {
		navigate('/options');
	};

	const [avatarLoading, setAvatarLoading] = useState(false);
	const [avatarError, setAvatarError] = useState('');
	const [avatarUrl, setAvatarUrl] = useState('');

	const handleFileSelect = () => {
		fileInputRef.current.click();
	};

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		await uploadAvatarFile(file);
		e.target.value = '';
	};

	const uploadAvatarFile = async (file) => {
		setAvatarLoading(true);
		setAvatarError('');
		const formData = new FormData();
		formData.append('image', file);
		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
				credentials: 'include',
			});
			const data = await res.json();
			if (data.res && data.res.url) {
				await saveAvatar(data.res.url);
				await dispatch(setUser({avatar: data.res.url}))
			} else {
				setAvatarError(data.error || 'Ошибка загрузки');
			}
		} catch (err) {
			setAvatarError('Сетевая ошибка', err);
		} finally {
			setAvatarLoading(false);
		}
	};

	const handleAvatarUrlSubmit = async () => {
		if (!avatarUrl.trim()) return;
		setAvatarLoading(true);
		setAvatarError('');
		try {
			await saveAvatar(avatarUrl.trim());
			await dispatch(setUser(avatarUrl.trim()))
			setAvatarUrl('');
		} catch (err) {
			setAvatarError(err.message || 'Ошибка');
		} finally {
			setAvatarLoading(false);
		}
	};

	const saveAvatar = async (url) => {
		const result = await request('/api/profile-user', 'PATCH', { avatar: url });
		if (result.error) {
			throw new Error(result.error);
		}
		await dispatch(setUser({avatar: url}))
		setAvatar(url);
	};

	if (profileLoading) return <Loader />;
	if (!currentUserId && !profile) return <Error error={profileError} />;
	if (!profile) return <div className={styles.notFound}>Пользователь не найден</div>;

	const color1 = getColorById(userId);
	const color2 = getColorById(userId + 'gradient');

	return (
		<div className={styles.profilePage}>

				<div
					className={profile.isDeleted ? styles.deletedCover : styles.cover}
					style={{
						background: `linear-gradient(135deg, ${color1}22, ${color2}44), radial-gradient(circle at 30% 50%, ${color1}33, transparent 70%)`,
					}}
				>
					<div
						style={{
							position: 'absolute',
							inset: '0',
							background: `linear-gradient(135deg, ${color1}22, ${color2}44), radial-gradient(circle at 30% 50%, ${color1}33, transparent 70%)`,
						}}
					/>
				</div>
			<div className={styles.profileContent}>
				<ProfileAvatar
					avatar={avatar}
					login={profile.login}
					isOwner={isOwner}
					avatarLoading={avatarLoading}
					avatarError={avatarError}
					avatarUrl={avatarUrl}
					setAvatarUrl={setAvatarUrl}
					onFileSelect={handleFileSelect}
					onFileChange={handleFileChange}
					onAvatarUrlSubmit={handleAvatarUrlSubmit}
					fileInputRef={fileInputRef}
					id={userId}
				/>

				<div className={styles.userInfo}>
					<h1 className={profile.isDeleted ? styles.deleted : styles.username}>
						{profile.isDeleted ? 'Deleted user:' : ''} {profile.login}
					</h1>


					<div className={styles.stats}>
						<div className={styles.statItem}>
							<span className={styles.statValue}>{posts.length}</span>
							<span className={styles.statLabel}>Публикаций</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statValue}>{friendsCount}</span>
							<span className={styles.statLabel}>Друзей</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statValue}>{followersCount}</span>
							<span className={styles.statLabel}>Подписчиков</span>
						</div>
						<div className={styles.statItem}>
							<span className={styles.statValue}>{followingCount}</span>
							<span className={styles.statLabel}>Подписок</span>
						</div>
					</div>
					{!profile.isDeleted && (
						<ProfileActions
							isOwner={isOwner}
							isFriend={isFriend}
							isFollowing={isFollowing}
							hasIncomingRequest={hasIncomingRequest}
							hasOutgoingRequest={hasOutgoingRequest}
							followLoading={followLoading}
							followSuccess={followSuccess}
							friendLoading={friendLoading}
							friendSuccess={friendSuccess}
							onToggleFollow={handleToggleFollow}
							onSendRequest={handleSendRequest}
							onCancelRequest={handleCancelRequest}
							onAcceptRequest={handleAcceptRequest}
							onRejectRequest={handleRejectRequest}
							onRemoveFriend={handleRemoveFriend}
							onLogout={handleLogout}
							onGoToSettings={handleGoToSettings}
						/>
					)}

					<div
						className={styles.registeredAt}
						style={{
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<span>
							Зарегистрирован:{' '}
							{new Date(profile.registeredAt).toLocaleDateString('ru-RU')}
						</span>
						{profile.isDeleted && (
							<span
								style={{
									color: 'red',
								}}
							>
								Удалён:{' '}
								{profile.isDeleted
									? new Date(profile.deletedAt).toLocaleDateString(
											'ru-RU',
										)
									: ''}
							</span>
						)}
					</div>
				</div>
			</div>

			<ProfilePosts posts={posts} loading={postsLoading} error={postsError} />
		</div>
	);
};
