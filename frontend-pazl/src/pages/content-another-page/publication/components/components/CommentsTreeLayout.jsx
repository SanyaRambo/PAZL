// src/pages/content-another-page/post-page/components/Comments/components/CommentsTreeLayout.jsx

import { memo } from 'react';
import { Button } from '../../../../../shared/ui-kit/button';
import { getCommentWord } from '../../../../../shared/lib/get-comment-word';
import { FormSendMessage } from '../../../../../widgets/content/form/FormSendMessage';
import { LikeSection } from '../../../../../widgets/content/likeAndDislike';
import {
	User2,
	Trash2,
	PencilIcon,
	ListChevronsUpDownIcon,
	ListChevronsDownUpIcon,
} from 'lucide-react';
import { CommentsTree } from './CommentsTree';
import styles from './comTreeAndInput.module.css';

export const CommentsTreeLayout = memo(
	({
		author,
		publishedAt,
		edited,
		text,
		isLong,
		truncatedText,
		isShowFullComment,
		toggleFullComment,
		isEditing,
		commentEdit,
		handleCommentEditChange,
		handleSaveEdit,
		isSaving,
		isReplyComment,
		replyComment,
		handleReplyChange,
		handleReplySubmit,
		isReplying,
		onReplyComment,
		onEditingComment,
		onDeleteClick,
		avatarAuthor,
		handleAvatarClick,
		avatarColor1,
		avatarColor2,
		childComments,
		isShowReplyComment,
		toggleShowReply,
		canEditOrDelete,
		isOwner,
		loading,
		idPublication,
		id,
		comments,
		commentsError,
		succesRoles,
		currentUserId,
		currentUserIdRole,
		onDeleteComment,
		handleSubmitComment,
		handleSubmitSaveComment,
		id_author_publication,
		isRemoving,
	}) => {
		return (
			<div
				className={`${styles.comment} ${childComments.length > 0 ? styles['has-children'] : ''} ${isRemoving ? styles.removing : ''}`}
			>
				<div className={styles.parrentComment}>
					<div className={styles.avatar}>
						<div
							onClick={handleAvatarClick}
							className={styles.profileLink}
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
										: { cursor: 'pointer' }
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
									isSending={isSaving}
									comment={commentEdit}
									onChange={handleCommentEditChange}
									onSubmit={handleSaveEdit}
									classNameButton={styles.toggleReplies}
									firstWordSubmit={'Сохранение...'}
									SecondWordSubmit={'Сохранить'}
									setIsStatus={() => {}}
									isStatus={isEditing}
									type={'text'}
									name={'comment'}
									maxLength={2000}
								/>
							) : (
								<div>
									{isLong ? (
										<>
											<div className={styles.commentText}>
												{isShowFullComment ? text : truncatedText}
											</div>
											<span
												className={styles.toggleText}
												onClick={toggleFullComment}
											>
												{isShowFullComment
													? 'Скрыть'
													: 'Раскрыть'}
												{isShowFullComment ? (
													<ListChevronsDownUpIcon size={16} />
												) : (
													<ListChevronsUpDownIcon size={16} />
												)}
											</span>
										</>
									) : (
										<div className={styles.commentText}>{text}</div>
									)}
									{isReplyComment ? (
										<FormSendMessage
											loading={loading}
											isSending={isReplying}
											comment={replyComment}
											onChange={handleReplyChange}
											onSubmit={handleReplySubmit}
											classNameButton={styles.toggleReplies}
											firstWordSubmit={'Отправка...'}
											SecondWordSubmit={'Отправить'}
											setIsStatus={() => {}}
											isStatus={isReplyComment}
											type={'text'}
											name={'comment'}
											maxLength={2000}
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

					{canEditOrDelete && (
						<div className={styles.action}>
							{isOwner && (
								<Button
									onClick={onEditingComment}
									className={styles.actionEdit}
								>
									<PencilIcon size={15} />
								</Button>
							)}
							<Button
								onClick={onDeleteClick}
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
								onClick={toggleShowReply}
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
