import { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FileText, Heart, Library, User } from 'lucide-react';
import { loadPublicationsUserAsync } from '../../../entities/publications-entite/actions';
import { loadLikedPostsAsync } from '../../../entities/liked-posts-entite/actions';
import {
	selectPublicationsUser,
	selectPublicationsLoading,
	selectPublicationsLoaded,
} from '../../../entities/publications-entite/selectors';
import {
	selectLikedPosts,
	selectLikedPostsLoading,
	selectLikedPostsLoaded,
} from '../../../entities/liked-posts-entite/selectors';
import { selectUserId, selectUserLogin } from '../../../entities/user-entite/selectors';
import { LoaderPost } from '../../../widgets/server-status';

import { setPostLike } from '../../../entities/likes-entite/actions';
import { PostCard } from '../../../widgets/content/post-card';
import styles from './mediaLibrary.module.css';

export const MediaLibrary = () => {
	const dispatch = useDispatch();
	const userId = useSelector(selectUserId);
	const userLogin = useSelector(selectUserLogin);
	const myPosts = useSelector(selectPublicationsUser);
	const myPostsLoading = useSelector(selectPublicationsLoading);
	const likedPosts = useSelector(selectLikedPosts);
	const likedPostsLoading = useSelector(selectLikedPostsLoading);
	const likedPostsLoaded = useSelector(selectLikedPostsLoaded);
	const publicationsLoaded = useSelector(selectPublicationsLoaded);
	const [activeTab, setActiveTab] = useState('my');
	const navigate = useNavigate();

	const initializedIds = useRef(new Set());

	useEffect(() => {
		if (userId && !publicationsLoaded && !myPostsLoading) {
			dispatch(loadPublicationsUserAsync());
		}
		if (userId && !likedPostsLoaded && !likedPostsLoading) {
			dispatch(loadLikedPostsAsync());
		}
	}, [
		userId,
		likedPostsLoaded,
		publicationsLoaded,
		dispatch,
		myPostsLoading,
		likedPostsLoading,
	]);

	useEffect(() => {
		initializedIds.current.clear();
	}, [userId]);


	const filteredPosts = useMemo(() => {
		if (activeTab === 'my') {
			return myPosts.filter((post) => post.author === userLogin);
		} else {
			return likedPosts.filter(
				(post) =>
					post.isPublished || (!post.isPublished && post.author === userLogin),
			);
		}
	}, [activeTab, myPosts, likedPosts, userLogin]);

	useEffect(() => {
		const newPosts = filteredPosts.filter(
			(post) => !initializedIds.current.has(post.id),
		);
		if (newPosts.length > 0) {
			newPosts.forEach((post) => {
				dispatch(
					setPostLike(post.id, {
						likesCount: post.likesCount ?? 0,
						dislikesCount: post.dislikesCount ?? 0,
						isLiked: post.isLiked ?? false,
						isDisliked: post.isDisliked ?? false,
					}),
				);
				initializedIds.current.add(post.id);
			});
		}
	}, [filteredPosts, dispatch]);

	const loading = activeTab === 'my' ? myPostsLoading : likedPostsLoading;

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>
					<Library size={28} className={styles.titleIcon} />
					Медиатека
				</h1>
				<div className={styles.tabs}>
					<button
						className={`${styles.tab} ${activeTab === 'my' ? styles.active : ''}`}
						onClick={() => setActiveTab('my')}
					>
						<User size={18} />
						Мои посты
					</button>
					<button
						className={`${styles.tab} ${activeTab === 'liked' ? styles.active : ''}`}
						onClick={() => setActiveTab('liked')}
					>
						<Heart size={18} />
						Понравившиеся
					</button>
				</div>
				<div className={styles.counter}>
					{filteredPosts.length}{' '}
					{filteredPosts.length === 1 ? 'пост' : 'постов'}
				</div>
			</div>

			<div className={styles.grid}>
				{filteredPosts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
				{loading ? (
					<LoaderPost />
				) : '' }
			</div>
				{filteredPosts.length === 0 && (
					<div className={styles.empty}>
						<FileText size={48} strokeWidth={1.5} />
						<p>
							{activeTab === 'my' ? (
								<span>
									У вас пока нет созданных постов. Создайте первый в{' '}
									<span
										style={{ color: 'green', cursor: 'pointer' }}
										onClick={() => navigate('/workshop')}
									>
										мастерской
									</span>
									!
								</span>
							) : (
								<span>
									Вы ещё не лайкнули ни один пост. Найдите что-то{' '}
									<span
										style={{ color: 'green', cursor: 'pointer' }}
										onClick={() => navigate('/publications')}
									>
										интересное
									</span>
									!
								</span>
							)}
						</p>
					</div>
				)}
		</div>
	);
};
