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
import { SortControls } from '../../../shared/ui-kit/sort-controls';
import { setPostLike } from '../../../entities/likes-entite/actions';
import { PostCard } from '../../../widgets/content/post-card';
import styles from './mediaLibrary.module.css';

export const MediaLibrary = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);
	const userLogin = useSelector(selectUserLogin);
	const myPosts = useSelector(selectPublicationsUser);
	const myPostsLoading = useSelector(selectPublicationsLoading);
	const likedPosts = useSelector(selectLikedPosts);
	const likedPostsLoading = useSelector(selectLikedPostsLoading);
	const likedPostsLoaded = useSelector(selectLikedPostsLoaded);
	const publicationsLoaded = useSelector(selectPublicationsLoaded);
	const [activeTab, setActiveTab] = useState('my');

		const [sortOption, setSortOption] = useState('createdAt_desc');

	const initializedIds = useRef(new Set());


	const mySortOptions = [
		{ value: 'createdAt_desc', label: 'Сначала новые (созданные)' },
		{ value: 'createdAt_asc', label: 'Сначала старые (созданные)' },
		{ value: 'publishedAt_desc', label: 'Сначала новые (опубликованные)' },
		{ value: 'publishedAt_asc', label: 'Сначала старые (опубликованные)' },
		{ value: 'views_desc', label: 'По просмотрам (сначала популярные)' },
	];


	const likedSortOptions = [
		{ value: 'likedAt_desc', label: 'Сначала новые (по дате лайка)' },
		{ value: 'likedAt_asc', label: 'Сначала старые (по дате лайка)' },
		{ value: 'publishedAt_desc', label: 'Сначала новые (опубликованные)' },
		{ value: 'publishedAt_asc', label: 'Сначала старые (опубликованные)' },
		{ value: 'views_desc', label: 'По просмотрам (сначала популярные)' },
	];

	useEffect(() => {
		if (userId && !publicationsLoaded && !myPostsLoading) {
			const [sortBy, order] = sortOption.split('_');
			dispatch(loadPublicationsUserAsync({ sortBy, order }));
		}
	}, [userId, publicationsLoaded, myPostsLoading, dispatch, sortOption]);

	useEffect(() => {
		if (userId && !likedPostsLoaded && !likedPostsLoading) {
			const [sortBy, order] = sortOption.split('_');
			dispatch(loadLikedPostsAsync({ sortBy, order }));
		}
	}, [userId, likedPostsLoaded, likedPostsLoading, dispatch, sortOption]);


	useEffect(() => {
		if (userId && publicationsLoaded) {
			const [sortBy, order] = sortOption.split('_');
			dispatch(loadPublicationsUserAsync({ sortBy, order }));
		}
	}, [sortOption, userId, publicationsLoaded, dispatch]);

	useEffect(() => {
		if (userId && likedPostsLoaded) {
			const [sortBy, order] = sortOption.split('_');
			dispatch(loadLikedPostsAsync({ sortBy, order }));
		}
	}, [sortOption, userId, likedPostsLoaded, dispatch]);

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


	const handleSortChange = (value) => {
		setSortOption(value);
	};

	const currentSortOptions = activeTab === 'my' ? mySortOptions : likedSortOptions;

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

			
			<SortControls
				options={currentSortOptions}
				value={sortOption}
				onChange={handleSortChange}
				label="Сортировать:"
			/>

			<div className={styles.grid}>
				{filteredPosts.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
				{loading && <LoaderPost />}
			</div>

			{filteredPosts.length === 0 && !loading && (
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
