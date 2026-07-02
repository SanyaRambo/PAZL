import styles from './publications.module.css';
import { usePaginatedData, useIntersectionObserver } from '../../../shared/hooks';
import { Error, LoaderPost } from '../../../widgets/server-status';
import { useEffect, useState, useRef, memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPostLike } from '../../../entities/likes-entite/actions';
import { PostCard } from '../../../widgets/content/post-card';
import { SortControls } from '../../../shared/ui-kit/sort-controls';

export const Publications = memo(({ inputValue }) => {
	const scrollContainerRef = useRef(null);
	const dispatch = useDispatch();
	const [savedScrollPosition, setSavedScrollPosition] = useState(0);

	const [sortOption, setSortOption] = useState('publishedAt_desc');

	const sortOptions = [
		{ value: 'publishedAt_desc', label: 'Новые' },
		{ value: 'publishedAt_asc', label: 'Старые' },
		{ value: 'views_desc', label: 'Популярные' },
	];

	const {
		data: publicationsOfUsers,
		loading: publicationsLoading,
		error: publicationsError,
		hasMore,
		loadMore,
		refetch,
	} = usePaginatedData('/api/publications', inputValue, 30);

	useEffect(() => {
		const [sortBy, order] = sortOption.split('_');
		refetch({ isPublished: true, sortBy, order });
	}, []);

	useEffect(() => {
		const [sortBy, order] = sortOption.split('_');
		refetch({ isPublished: true, sortBy, order });
	}, [inputValue]);


	const handleSortChange = (sortValue) => {
		setSortOption(sortValue);
		const [sortBy, order] = sortValue.split('_');
		refetch({ isPublished: true, sortBy, order });
	};


	useEffect(() => {
		if (publicationsOfUsers && publicationsOfUsers.length > 0) {
			publicationsOfUsers.forEach((post) => {
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
	}, [publicationsOfUsers, dispatch]);

	useEffect(() => {
		if (
			!publicationsLoading &&
			publicationsOfUsers.length > 0 &&
			scrollContainerRef.current
		) {
			requestAnimationFrame(() => {
				scrollContainerRef.current.scrollTop = savedScrollPosition;
			});
		}
	}, [publicationsLoading, publicationsOfUsers.length, savedScrollPosition]);


	const handleIntersect = useCallback(() => {
		if (hasMore && !publicationsLoading) {
			if (scrollContainerRef.current) {
				setSavedScrollPosition(scrollContainerRef.current.scrollTop);
			}
			loadMore();
		}
	}, [hasMore, publicationsLoading, loadMore]);

	const sentinelRef = useIntersectionObserver(handleIntersect, {
		root: null,
		rootMargin: '0px 0px 200px 0px',
		threshold: 0.1,
	});

	if (publicationsError) {
		return (
			<div className={styles.error}>
				Ошибка загрузки постов: {publicationsError}
			</div>
		);
	}

	return (
		<div ref={scrollContainerRef} className={styles.publicationsContainer}>
			<SortControls
				options={sortOptions}
				value={sortOption}
				onChange={handleSortChange}
				label="Сортировать:"
			/>
			<div className={styles.postsGrid}>
				{publicationsOfUsers.map((post) => (
					<PostCard key={post.id} post={post} />
				))}
				{publicationsLoading && <LoaderPost />}
				{!publicationsLoading &&
					publicationsOfUsers.length === 0 &&
					inputValue && (
						<h1 className={styles.postsNot}>Таких постов не существует</h1>
					)}
				{!publicationsLoading &&
					publicationsOfUsers.length === 0 &&
					!inputValue && <h1 className={styles.postsNot}>Постов пока нет</h1>}
			</div>
			<div ref={sentinelRef} style={{ height: '50px', marginBottom: '20px' }} />
		</div>
	);
});
