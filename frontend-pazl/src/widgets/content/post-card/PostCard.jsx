import { useNavigate, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { selectUserId, selectUserRole } from '../../../entities/user-entite/selectors';
import { setEditingPost } from '../../../entities/editor-entite/actions';
import styles from './postCard.module.css';
import { ROLE } from '../../../shared/constants';
import { Calendar, Eye, FileText, User2 } from 'lucide-react';
import { LikeSection } from '../likeAndDislike';
import { getColorById } from '../../../shared/utils/getColorById';
import { getPlainTextFromJSON } from '../../../shared/utils/planTextJSON';
import { request } from '../../../shared/utils/request';
import { useState } from 'react';
import { DeletedPostCard } from './DeletedPostCard';
import { ConfirmModal } from '../../../widgets/modal-window/confirm-modal';

export const PostCard = ({ post }) => {
	const {
		id,
		title,
		image,
		author,
		idAuthor,
		publishedAt,
		createdAt,
		isPublished,
		content,
		views,
		avatarAuthor,
		isAuthorDeleted,
	} = post;
	const currentUserRole = useSelector(selectUserRole);
	const currentUserId = useSelector(selectUserId);
	const [isDeleted, setIsDeleted] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();


	const likeData = useSelector((state) => state.likes.posts[id]);
	const likeKey = likeData ? `${likeData.isLiked}-${likeData.likesCount}` : 'init';

	const handleEditClick = (e) => {
		e.stopPropagation();
		e.preventDefault();
		dispatch(setEditingPost(post));
		navigate('/workshop');
	};

	const isOwner = idAuthor === currentUserId;
	const isAdmin = ROLE.ADMIN === currentUserRole;

	const handleAvatarClick = (e) => {
		e.stopPropagation();
		e.preventDefault();
		navigate(`/profile-user/${idAuthor}`);
	};

	const handleDeletePostClick = (e) => {
		e.stopPropagation();
		e.preventDefault();
		setShowDeleteModal(true);
	};

	const confirmDeletePost = async () => {
		setShowDeleteModal(false);
		const data = await request(`/api/publications/${id}`, 'DELETE');
		if (data.res) {
			setIsDeleted(true);
		} else {
			console.log('Ошибка в удалении поста', data.error);
		}
	};

	if (isDeleted) {
		return <DeletedPostCard />;
	}

	return (
		<>
			<NavLink to={`/publications/${id}`} className={styles.card}>
				<div className={styles.cardImage}>
					{image ? (
						<img src={image} alt={title || 'Превью'} />
					) : (
						<div className={styles.placeholderImage}>
							<FileText size={32} />
						</div>
					)}
				</div>
				<div className={styles.cardBody}>
					<h3 className={styles.cardTitle}>{title || 'Без названия'}</h3>
					<div className={styles.cardMeta}>
						<div className={styles.avaAndLogin}>
							<div
								className={styles.avatarLink}
								onClick={handleAvatarClick}
								style={{ cursor: 'pointer' }}
							>
								{avatarAuthor ? (
									<img
										src={avatarAuthor}
										alt={author}
										className={styles.avatarWrapper}
									/>
								) : (
									<div
										className={styles.avatarWrapper}
										style={{
											background: `linear-gradient(135deg, ${getColorById(idAuthor)}, ${getColorById(idAuthor + '1')})`,
										}}
									>
										<User2 size={15} strokeWidth={1.2} />
									</div>
								)}
							</div>
							<span
								className={
									isAuthorDeleted ? styles.deleted : styles.author
								}
								onClick={handleAvatarClick}
								style={{ cursor: 'pointer' }}
							>
								{author || 'Неизвестный автор'}
							</span>
						</div>
						<span className={styles.date}>
							<Calendar size={14} />
							{publishedAt || createdAt || 'Дата неизвестна'}
						</span>
					</div>
					<div className={styles.cardPreview}>
						{getPlainTextFromJSON(content).slice(0, 120)}...
					</div>
					<div className={styles.badgeContainer}>
						{isOwner && (
							<>
								<span
									className={`${styles.publishedBadge} ${isPublished ? styles.published : styles.unpublished}`}
								>
									{isPublished ? 'Опубликовано' : 'Не опубликовано'}
								</span>
								<span
									className={`${styles.publishedBadge} ${styles.editBadge}`}
									onClick={handleEditClick}
								>
									Редактировать
								</span>
							</>
						)}
						{isOwner || isAdmin ? (
							<span
								className={`${styles.publishedBadge} ${styles.deleteBadge}`}
								onClick={handleDeletePostClick}
							>
								Удалить
							</span>
						) : (
							''
						)}
					</div>
					<div className={styles.cardStats}>
						<span className={styles.cardViews}>
							<Eye size={16} /> {views || 0}
						</span>
						<LikeSection
							key={likeKey}
							entityId={id}
							idPublication={id}
							isComment={false}
						/>
					</div>
				</div>
			</NavLink>

			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={confirmDeletePost}
				title="Удаление поста"
				message={`Вы действительно хотите удалить пост "${title || 'Без названия'}"? Это действие необратимо.`}
				confirmText="Да, удалить"
				cancelText="Отмена"
				variant="danger"
			/>
		</>
	);
};
