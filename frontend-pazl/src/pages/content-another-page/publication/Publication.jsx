import styles from './publication.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useRequestServer } from '../../../shared/hooks';
import { ROLE } from '../../../shared/constants';
import { Error, PublicationSkeleton } from '../../../widgets/server-status';
import { PostContentViewer } from '../../../widgets/content/post';
import { selectUserRole, selectUserLogin } from '../../../entities/user-entite/selectors';
import { Comments } from './components/Comments';
import { setPostLike } from '../../../entities/likes-entite/actions';
import { LikeSection } from '../../../widgets/content/likeAndDislike';
import { Eye, User2 } from 'lucide-react';
import { setEditingPost } from '../../../entities/editor-entite/actions';
import { loadLikedPostsAsync } from '../../../entities/liked-posts-entite/actions';
import { loadPublicationsUserAsync } from '../../../entities/publications-entite/actions';
import { getColorById } from '../../../shared/utils/getColorById';

export const Publication = () => {
	const currentUserLogin = useSelector(selectUserLogin);
	const params = useParams();
	const [isImageLoading, setIsImageLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const {
		data: publication,
		error: publicationError,
		loading: publicationLoading,
	} = useRequestServer(`/api/publications/${params.id}`, 'GET');

	const currentUserIdRole = useSelector(selectUserRole);

	useEffect(() => {
		if (publication) {
			dispatch(
				setPostLike(publication.id, {
					likesCount: publication.likesCount,
					dislikesCount: publication.dislikesCount,
					isLiked: publication.isLiked,
					isDisliked: publication.isDisliked,
				}),
			);
			dispatch(loadLikedPostsAsync());
			dispatch(loadPublicationsUserAsync());
		}
	}, [publication, dispatch]);

	if (publicationLoading || !publication) {
		return <PublicationSkeleton />;
	}

	if (publicationError || !publication) {
		return <Error error={publicationError} />;
	}

	const {
		id,
		idAuthor,
		title,
		content,
		author,
		publishedAt,
		image,
		views,
		avatarAuthor,
	} = publication;

	const isOwner = author === currentUserLogin;

	const handleEditClick = (e) => {
		e.stopPropagation();
		e.preventDefault();
		dispatch(setEditingPost(publication));
		navigate('/workshop');
	};

	// Переход в профиль по клику на аватарку
	const handleAvatarClick = (e) => {
		e.stopPropagation();
		navigate(`/profile-user/${idAuthor}`);
	};

	const renderCover = () => {
		if (!image) {
			return <div className={styles.coverPlaceholder} />;
		}
		return (
			<div className={styles.coverWrapper}>
				{isImageLoading && <div className={styles.skeletonCover} />}
				<img
					src={image}
					alt="Превью"
					className={styles.coverImage}
					style={{ opacity: isImageLoading ? 0 : 1 }}
					onLoad={() => setIsImageLoading(false)}
					onError={() => setIsImageLoading(false)}
				/>
			</div>
		);
	};

	return (
		<>
			<div className={styles.container}>
				{renderCover()}
				<h1 className={styles.title}>{title}</h1>
				<div className={styles.meta}>
					<div className={styles.info}>
						<div className={styles.infoLeft}>
							<div
								onClick={handleAvatarClick}
								className={styles.avatarLink}
								style={{ cursor: 'pointer' }}
							>
								{avatarAuthor ? (
									<img
										src={avatarAuthor}
										alt={author}
										className={styles.avatarAuthor}
									/>
								) : (
									<div
										className={styles.avatarAuthor}
										style={{
											background: `linear-gradient(135deg, ${getColorById(idAuthor)}, ${getColorById(idAuthor + '1')})`,
										}}
									>
										<User2 size={18} strokeWidth={1.2} />
									</div>
								)}
							</div>
							<span
								className={
									author.includes('Deleted') ? styles.authorDeleted : ''
								}
								onClick={handleAvatarClick}
								style={{ cursor: 'pointer' }}
							>
								{author}
							</span>
							<span className={styles.separator}>|</span>
							<span>{publishedAt}</span>
							{isOwner && (
								<>
									<span className={styles.separator}>|</span>
									<div className={styles.badgeContainer}>
										<span
											className={`${styles.publishedBadge} ${styles.editBadge}`}
											onClick={handleEditClick}
										>
											Перейти к редактированию
										</span>
									</div>
								</>
							)}
						</div>
						<div className={styles.infoRight}>
							<div className={styles.views}>
								<div className={styles.viewsCount}>{views}</div>
								<Eye />
							</div>
							<LikeSection
								entityId={id}
								idPublication={id}
								isComment={false}
							/>
						</div>
					</div>
				</div>
				<div className={styles.content}>
					<PostContentViewer content={content} />
				</div>
				<div className={styles.meta}>
					<div className={styles.info}>
						<div className={styles.infoLeft}>
							<div
								onClick={handleAvatarClick}
								className={styles.avatarLink}
								style={{ cursor: 'pointer' }}
							>
								{avatarAuthor ? (
									<img
										src={avatarAuthor}
										alt={author}
										className={styles.avatarAuthor}
									/>
								) : (
									<div
										className={styles.avatarAuthor}
										style={{
											background: `linear-gradient(135deg, ${getColorById(idAuthor)}, ${getColorById(idAuthor + '1')})`,
										}}
									>
										<User2 size={18} strokeWidth={1.2} />
									</div>
								)}
							</div>
							<span
								className={
									author.includes('Deleted') ? styles.authorDeleted : ''
								}
								onClick={handleAvatarClick}
								style={{ cursor: 'pointer' }}
							>
								{author}
							</span>
							<span className={styles.separator}>|</span>
							<span>{publishedAt}</span>
							{isOwner && (
								<>
									<span className={styles.separator}>|</span>
									<div className={styles.badgeContainer}>
										<span
											className={`${styles.publishedBadge} ${styles.editBadge}`}
											onClick={handleEditClick}
										>
											Перейти к редактированию
										</span>
									</div>
								</>
							)}
						</div>
						<div className={styles.infoRight}>
							<div className={styles.views}>
								<div className={styles.viewsCount}>{views}</div>
								<Eye />
							</div>
							<LikeSection
								entityId={id}
								idPublication={id}
								isComment={false}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.blockComments}>
				{currentUserIdRole !== ROLE.GUEST ? (
					<Comments idPublication={id} idAuthor={idAuthor} />
				) : (
					<h1>
						Авторизируйтесь или зарегистрируйтесь, чтобы иметь больше
						возможностей.
					</h1>
				)}
			</div>
		</>
	);
};
