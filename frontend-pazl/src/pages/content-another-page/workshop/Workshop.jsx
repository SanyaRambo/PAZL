import styles from './workshop.module.css';
import { RichTextEditor } from './components';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectPublicationsUser,
	selectPublicationsError,
	selectPublicationsLoading,
	selectPublicationsLoaded,
} from '../../../entities/publications-entite/selectors';
import { selectUserId } from '../../../entities/user-entite/selectors';
import { memo, useEffect, useState } from 'react';
import { Error, Loader } from '../../../widgets/server-status';
import { loadPublicationsUserAsync } from '../../../entities/publications-entite/actions';
import { createNewPost, setEditingPost } from '../../../entities/editor-entite/actions';
import { Button } from '../../../shared/ui-kit/button';
import { deletePostAsync } from '../../../entities/editor-entite/actions/delete-post-async';
import { Trash2 } from 'lucide-react';
import { LikeSection } from '../../../widgets/content/likeAndDislike';
import { ConfirmModal } from '../../../widgets/modal-window/confirm-modal'; 

export const Workshop = memo(() => {
	const postsLoading = useSelector(selectPublicationsLoading);
	const postsUser = useSelector(selectPublicationsUser);
	const postsError = useSelector(selectPublicationsError);
	const postsLoaded = useSelector(selectPublicationsLoaded);
	const currentUserId = useSelector(selectUserId);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [postToDelete, setPostToDelete] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!postsLoaded) {
			dispatch(loadPublicationsUserAsync());
		}
	}, [postsLoaded, dispatch, currentUserId]);

	if (postsLoading) {
		return <Loader />;
	}

	if (postsError) {
		return <Error error={postsError} />;
	}

	// Обработчик подтверждения удаления
	const confirmDeletePost = () => {
		if (postToDelete) {
			dispatch(deletePostAsync(postToDelete.id));
			setPostToDelete(null);
		}
	};

	return (
		<div className={styles.workshopWrapper}>
			<div className={`${styles.sidebar} ${!sidebarOpen && styles.sidebarClosed}`}>
				{sidebarOpen && (
					<>
						<button
							className={styles.createButton}
							onClick={() => dispatch(createNewPost())}
						>
							+ Создать пост
						</button>
						<div className={styles.postList}>
							{postsUser.map((post) => (
								<div
									key={post.id}
									className={styles.postItem}
									onClick={() => dispatch(setEditingPost(post))}
								>
									{post.image && (
										<img
											src={post.image}
											alt=""
											className={styles.postImage}
										/>
									)}
									<div className={styles.postInfo}>
										<div className={styles.postTitle}>
											{post.title || 'Новый пост'}
										</div>
										<div className={styles.postDate}>
											Создано: {post.createdAt}
										</div>
										{post.isPublished && (
											<div className={styles.postDate}>
												Опубликовано: {post.publishedAt}
											</div>
										)}
									</div>
									<button
										className={styles.deleteButton}
										onClick={(e) => {
											e.stopPropagation();
											setPostToDelete(post);
										}}
										title="Удалить публикацию"
									>
										<Trash2 size={10} />
									</button>
								</div>
							))}
						</div>
					</>
				)}
			</div>
			<button
				className={`${styles.floatingToggle} ${sidebarOpen && styles.floatingToggleShifted}`}
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				{sidebarOpen ? '‹' : '›'}
			</button>
			<div
				className={`${styles.editorArea} ${sidebarOpen && styles.editorAreaWithSidebar}`}
			>
				<RichTextEditor />
			</div>
			<ConfirmModal
				isOpen={!!postToDelete}
				onClose={() => setPostToDelete(null)}
				onConfirm={confirmDeletePost}
				title="Удаление поста"
				message={`Вы действительно хотите удалить пост "${postToDelete?.title || 'Без названия'}"? Это действие необратимо.`}
				confirmText="Да, удалить"
				cancelText="Отмена"
				variant="danger"
			/>
		</div>
	);
});
