import styles from './publications.module.css';
import { usePaginatedData } from '../../../shared/hooks';
import { Error, LoaderPost } from '../../../widgets/server-status';
import { useEffect, useState, useRef, memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setPostLike } from '../../../entities/likes-entite/actions';
import { PostCard } from '../../../widgets/content/post-card';
import { SortControls } from '../../../shared/ui-kit/sort-controls';
import { VirtuosoGrid } from 'react-virtuoso';

const sortOptions = [
	{ value: 'publishedAt_desc', label: 'Новые' },
	{ value: 'publishedAt_asc', label: 'Старые' },
	{ value: 'views_desc', label: 'Популярные' },
];

export const Publications = memo(({ inputValue }) => {
	const dispatch = useDispatch();
	const [sortOption, setSortOption] = useState('publishedAt_desc');
	const processedIdsRef = useRef(new Set());

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
	}, [refetch, sortOption, inputValue]);

	const handleSortChange = useCallback((sortValue) => {
		setSortOption(sortValue);
	}, []);


	useEffect(() => {
		if (publicationsOfUsers && publicationsOfUsers.length > 0) {
			publicationsOfUsers.forEach((post) => {
				if (!processedIdsRef.current.has(post.id)) {
					dispatch(
						setPostLike(post.id, {
							likesCount: post.likesCount,
							dislikesCount: post.dislikesCount,
							isLiked: post.isLiked,
							isDisliked: post.isDisliked,
						}),
					);
					processedIdsRef.current.add(post.id);
				}
			});
		}
	}, [publicationsOfUsers, dispatch]);

	if (publicationsError) {
		return (
			<div className={styles.error}>
				Ошибка загрузки постов: {publicationsError}
			</div>
		);
	}

	return (
		<div className={styles.publicationsContainer}>
			<SortControls
				options={sortOptions}
				value={sortOption}
				onChange={handleSortChange}
				label="Сортировать:"
			/>
			<div className={styles.listWrapper}>
				<VirtuosoGrid
					style={{ height: '100%', width: '100%' }}
					totalCount={publicationsOfUsers.length}
					itemContent={(index) => {
						const post = publicationsOfUsers[index];
						return <PostCard key={post.id} post={post} />;
					}}
					endReached={() => {
						if (hasMore && !publicationsLoading) {
							loadMore();
						}
					}}
					components={{
						Footer: () =>
							publicationsLoading ? (
								<div className={styles.footerGrid}>
									{Array.from({ length: 6 }).map((_, i) => (
										<LoaderPost key={i} />
									))}
								</div>
							) : null,
						EmptyPlaceholder: () => (
							<h1 className={styles.postsNot}>
								{inputValue
									? 'Таких постов не существует'
									: 'Постов пока нет'}
							</h1>
						),
					}}
					overscan={5}
					listClassName={styles.postsGrid}
				/>
			</div>
		</div>
	);
});
