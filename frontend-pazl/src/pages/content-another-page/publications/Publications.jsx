import styles from './publications.module.css';
import { usePaginatedData, useIntersectionObserver } from '../../../shared/hooks';
import { Error, Loader, LoaderPost } from '../../../widgets/server-status';
import { PostContentViewer } from '../../../widgets/content/post';
import { Link, NavLink } from 'react-router-dom';
import { useEffect, useState, useRef, memo, useLayoutEffect, useCallback } from 'react';
import { Eye, Calendar } from 'lucide-react';
import { LikeSection } from '../../../widgets/content/likeAndDislike';
import { useDispatch } from 'react-redux';
import { setPostLike } from '../../../entities/likes-entite/actions';
import { PostCard } from '../../../widgets/content/post-card';

export const Publications = memo(({ inputValue }) => {
	const scrollContainerRef = useRef(null);
	const dispatch = useDispatch();
	const [savedScrollPosition, setSavedScrollPosition] = useState(0);

	const {
		data: publicationsOfUsers,
		loading: publicationsLoading,
		error: publicationsError,
		hasMore,
		loadMore,
		refetch,
	} = usePaginatedData('/api/publications?isPublished=true', inputValue, 30);

	useLayoutEffect(() => {
		refetch();
	}, [inputValue]);

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

	const observerOptions = {
		root: null,
		rootMargin: '0px 0px 200px 0px',
		threshold: 0.1,
	};

	const sentinelRef = useIntersectionObserver(handleIntersect, observerOptions);

	if (publicationsError) {
		return <Error error={publicationsError} />;
	}

	return (
		<div ref={scrollContainerRef} className={styles.publicationsContainer}>
			<div className={styles.postsGrid}>
				{publicationsOfUsers.map(
					(post) => (
						<PostCard key={post.id} post={post}/>
					),
				)}
				{publicationsLoading ? (
					<LoaderPost />
				) : publicationsOfUsers.length === 0 && inputValue && !hasMore ? (
					<h1 className={styles.postsNot}>Таких постов не существует</h1>
				) : (
					''
				)}
			</div>
			<div
				ref={sentinelRef}
				style={{
					height: '50px',
					marginBottom: '20px',
				}}
			></div>
		</div>
	);
});
