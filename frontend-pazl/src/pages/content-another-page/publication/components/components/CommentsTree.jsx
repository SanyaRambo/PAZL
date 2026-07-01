import { Error, Loader } from '../../../../../widgets/server-status';
import { memo, useEffect, useRef, useState } from 'react';
import { Button } from '../../../../../shared/ui-kit/button';
import { getCommentWord } from '../../../../../shared/lib/get-comment-word';
import { FormSendMessage } from '../../../../../widgets/content/form/FormSendMessage';
import { LikeSection } from '../../../../../widgets/content/likeAndDislike';
import { getColorById } from '../../../../../shared/utils/getColorById';
import { useNavigate } from 'react-router-dom';
import { User2 } from 'lucide-react';
import styles from './comTreeAndInput.module.css';
import {
	Trash2,
	PencilIcon,
	ListChevronsUpDownIcon,
	ListChevronsDownUpIcon,
} from 'lucide-react';

export const CommentsTree = memo(
	({
		comments,
		commentsError,
		succesRoles,
		currentUserId,
		currentUserIdRole,
		onDeleteComment,
		id,
		idAuthor,
		author,
		publishedAt,
		text,
		handleSubmitSaveComment,
		handleSubmitComment,
		isSending,
		loading,
		edited,
		id_author_publication,
		idPublication,
		avatarAuthor,
	}) => {
		const [replyComment, setReplyComment] = useState('');
		const [isEditing, setIsEditing] = useState(false);
		const [commentEdit, setCommentEdit] = useState(text);
		const [isReplyComment, setIsReplyComment] = useState(false);
		const [isShowReplyComment, setIsShowReplyComment] = useState(false);
		const [isShowFullComment, setIsShowFullComment] = useState(false);

		const childComments = comments.filter((comment) => comment.idParent === id);
		const textareaRef = useRef(null);
		const navigate = useNavigate();

		const onEditingComment = (text) => {
			setIsEditing(true);
			setCommentEdit(text);
		};

		const onReplyComment = () => {
			setIsReplyComment(true);
		};

		const onShowReplyComment = () => {
			setIsShowReplyComment(!isShowReplyComment);
		};

		useEffect(() => {
			if (isEditing && textareaRef.current) {
				const textarea = textareaRef.current;
				textarea.focus();
				const pos = textarea.value.length;
				if (textarea.setSelectionRange) {
					textarea.setSelectionRange(pos, pos);
				}
			}
		}, [isEditing, id]);

		if (isSending || loading) {
			return <Loader className={styles.loader} />;
		}

		const avatarColor1 = getColorById(idAuthor);
		const avatarColor2 = getColorById(idAuthor + 'gradient');

		const handleAvatarClick = (e) => {
			e.stopPropagation();
			navigate(`/profile-user/${idAuthor}`);
		};

		return (
			<div
				className={`${styles.comment} ${childComments.length > 0 ? styles['has-children'] : ''}`}
			>
				<div className={styles.parrentComment}>
					<div className={styles.avatar}>
						<div
							onClick={handleAvatarClick}
							className={styles.profileLink}
							style={{ cursor: 'pointer' }}
						>
							{avatarAuthor ? (
								<img src={avatarAuthor} alt={author} className={styles.avatarWrapper}/>
							) : (
								<div
									className={styles.avatarWrapper}
									style={{
										background: `linear-gradient(135deg, ${avatarColor1}, ${avatarColor2})`,
									}}
								>
									<User2 size={20} strokeWidth={1.5} />
								</div>
							)}
						</div>
						{childComments.length > 0 && <div className={styles.tree}></div>}
					</div>

					<div className={styles.leftPartComment}>
						<div className={styles.infoOfComment}>
							<div
								style={
									author?.includes('Deleted')
										? { color: '#ff6b6b' }
										: {},
										{cursor: 'pointer'}
								}
								onClick={handleAvatarClick}
								className={styles.login}
							>
								{author}
							</div>
							<div>
								{publishedAt}
								{edited && `(изменено в ${edited})`}
							</div>

							{isEditing ? (
								<FormSendMessage
									loading={loading}
									isSending={isSending}
									comment={commentEdit}
									onChange={(event) =>
										setCommentEdit(event.target.value)
									}
									onSubmit={(event) =>
										handleSubmitSaveComment(id, commentEdit, event)
									}
									classNameButton={styles.toggleReplies}
									firstWordSubmit={'Сохранение...'}
									SecondWordSubmit={'Сохранить'}
									setIsStatus={setIsEditing}
									isStatus={isEditing}
									type={'text'}
									name={'comment'}
									ref={textareaRef}
								/>
							) : (
								<div>
									{text.length > 350 ? (
										<>
											{isShowFullComment ? (
												<div>
													{text}
													<span title="Скрыть текст">
														<ListChevronsDownUpIcon
															size={23}
															strokeWidth={1.5}
															style={{
																verticalAlign: 'middle',
																color: '#a6a6a6',
																cursor: 'pointer',
																paddingLeft: '5px',
															}}
															onClick={() =>
																setIsShowFullComment(
																	false,
																)
															}
														/>
													</span>
												</div>
											) : (
												<div>
													{text.slice(0, 350).concat('...')}
													<span title="Раскрыть текст">
														<ListChevronsUpDownIcon
															size={23}
															strokeWidth={1.5}
															style={{
																verticalAlign: 'middle',
																color: '#a6a6a6',
																cursor: 'pointer',
																paddingLeft: '5px',
															}}
															onClick={() =>
																setIsShowFullComment(true)
															}
														/>
													</span>
												</div>
											)}
										</>
									) : (
										<div>{text}</div>
									)}
									{isReplyComment ? (
										<FormSendMessage
											loading={loading}
											isSending={isSending}
											comment={replyComment}
											onChange={(event) =>
												setReplyComment(event.target.value)
											}
											onSubmit={(event) =>
												handleSubmitComment(
													event,
													replyComment,
													id,
												)
											}
											classNameButton={styles.toggleReplies}
											firstWordSubmit={'Отправка...'}
											SecondWordSubmit={'Отправить'}
											setIsStatus={setIsReplyComment}
											isStatus={isReplyComment}
											type={'text'}
											name={'comment'}
											ref={textareaRef}
										/>
									) : (
										<Button
											onClick={onReplyComment}
											className={styles.toggleReplies}
										>
											Ответить
										</Button>
									)}
								</div>
							)}
							<LikeSection
								entityId={id}
								idPublication={idPublication}
								isComment={true}
							/>
						</div>
					</div>

					{(succesRoles.includes(currentUserIdRole) ||
						currentUserId === idAuthor ||
						currentUserId === id_author_publication) && (
						<div className={styles.action}>
							{currentUserId === idAuthor && (
								<Button
									onClick={() => onEditingComment(text)}
									className={styles.actionEdit}
								>
									<PencilIcon size={15} />
								</Button>
							)}
							<Button
								onClick={() => onDeleteComment(id)}
								className={styles.actionDelete}
							>
								<Trash2 size={15} />
							</Button>
						</div>
					)}
				</div>
				{childComments.length > 0 && (
					<div className={styles.childRepliesContainer}>
						<div className={styles.numberComments}>
							<Button
								className={styles.toggleReplies}
								onClick={onShowReplyComment}
							>
								{isShowReplyComment
									? 'Скрыть комментарии'
									: 'Показать комментарии'}
							</Button>
							<h3 className={styles.repliesCount}>
								{`${childComments.length} ${getCommentWord(childComments.length)}`}
							</h3>
						</div>

						<div
							className={`${styles.repliesWrapper} ${isShowReplyComment ? styles.visible : ''}`}
						>
							{isShowReplyComment &&
								childComments.map((comment) => (
									<CommentsTree
										key={comment.id}
										comments={comments}
										commentsError={commentsError}
										succesRoles={succesRoles}
										currentUserId={currentUserId}
										currentUserIdRole={currentUserIdRole}
										onDeleteComment={onDeleteComment}
										isSending={isSending}
										handleSubmitComment={handleSubmitComment}
										handleSubmitSaveComment={handleSubmitSaveComment}
										id={comment.id}
										idAuthor={comment.idAuthor}
										author={comment.author}
										publishedAt={comment.publishedAt}
										text={comment.text}
										loading={loading}
										edited={comment.editedAt}
										idParent={comment.idParent}
										id_author_publication={id_author_publication}
										idPublication={idPublication}
										avatarAuthor={comment.avatarAuthor}
									/>
								))}
						</div>
					</div>
				)}
			</div>
		);
	},
);
