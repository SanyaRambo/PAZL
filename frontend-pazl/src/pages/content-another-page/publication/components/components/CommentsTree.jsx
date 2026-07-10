import { memo, useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getColorById } from '../../../../../shared/utils/getColorById';
import { truncateText } from '../../../../../shared/utils/truncateText';
import { CommentsTreeLayout } from './CommentsTreeLayout';
import { ConfirmModal } from '../../../../../widgets/modal-window/confirm-modal';

const MAX_COMMENT_LENGTH = 2000;

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
		const [isSaving, setIsSaving] = useState(false);
		const [isReplying, setIsReplying] = useState(false);
		const [isRemoving, setIsRemoving] = useState(false);
		const [showDeleteModal, setShowDeleteModal] = useState(false);
		const [warningModal, setWarningModal] = useState({ open: false, message: '' });

		const childComments = useMemo(() => {
			return comments.filter((comment) => comment.idParent === id);
		}, [comments, id]);

		const truncatedText = useMemo(() => truncateText(text, 350), [text]);
		const isLong = text.length > 350;

		const textareaRef = useRef(null);
		const navigate = useNavigate();

		const handleAvatarClick = (e) => {
			e.stopPropagation();
			navigate(`/profile-user/${idAuthor}`);
		};

		const onEditingComment = () => {
			setIsEditing(true);
			setCommentEdit(text);
		};

		const onReplyComment = () => {
			setIsReplyComment(true);
		};

		const toggleShowReply = () => {
			setIsShowReplyComment(!isShowReplyComment);
		};

		const toggleFullComment = () => {
			setIsShowFullComment(!isShowFullComment);
		};

		const showWarning = (message) => {
			setWarningModal({ open: true, message });
		};

		const handleSaveEdit = async (event) => {
			event.preventDefault();
			if (isSaving) return;
			if (commentEdit.length > MAX_COMMENT_LENGTH) {
				showWarning(
					`Комментарий не может превышать ${MAX_COMMENT_LENGTH} символов.`,
				);
				return;
			}
			setIsSaving(true);
			try {
				await handleSubmitSaveComment(id, commentEdit, event);
				setIsEditing(false);
				setCommentEdit('');
			} finally {
				setIsSaving(false);
			}
		};

		const handleReplySubmit = async (event) => {
			event.preventDefault();
			if (isReplying) return;
			if (replyComment.length > MAX_COMMENT_LENGTH) {
				showWarning(
					`Комментарий не может превышать ${MAX_COMMENT_LENGTH} символов.`,
				);
				return;
			}
			setIsReplying(true);
			try {
				await handleSubmitComment(event, replyComment, id);
				setIsReplyComment(false);
				setIsShowReplyComment(true);
				setReplyComment('');
			} finally {
				setIsReplying(false);
			}
		};

		const handleDeleteClick = () => {
			setShowDeleteModal(true);
		};

		const confirmDelete = async () => {
			setShowDeleteModal(false);
			setIsRemoving(true);
			setTimeout(async () => {
				await onDeleteComment(id);
				setIsRemoving(false);
			}, 300);
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

		const avatarColor1 = getColorById(idAuthor);
		const avatarColor2 = getColorById(idAuthor + 'gradient');

		const canEditOrDelete =
			succesRoles.includes(currentUserIdRole) ||
			currentUserId === idAuthor ||
			currentUserId === id_author_publication;

		const isOwner = currentUserId === idAuthor;

		return (
			<>
				<CommentsTreeLayout
					author={author}
					publishedAt={publishedAt}
					edited={edited}
					text={text}
					isLong={isLong}
					truncatedText={truncatedText}
					isShowFullComment={isShowFullComment}
					toggleFullComment={toggleFullComment}
					isEditing={isEditing}
					commentEdit={commentEdit}
					handleCommentEditChange={(e) => setCommentEdit(e.target.value)}
					handleSaveEdit={handleSaveEdit}
					isSaving={isSaving}
					isReplyComment={isReplyComment}
					replyComment={replyComment}
					handleReplyChange={(e) => setReplyComment(e.target.value)}
					handleReplySubmit={handleReplySubmit}
					isReplying={isReplying}
					onReplyComment={onReplyComment}
					onEditingComment={onEditingComment}
					onDeleteClick={handleDeleteClick}
					idAuthor={idAuthor}
					handleAvatarClick={handleAvatarClick}
					avatarColor1={avatarColor1}
					avatarColor2={avatarColor2}
					childComments={childComments}
					isShowReplyComment={isShowReplyComment}
					toggleShowReply={toggleShowReply}
					canEditOrDelete={canEditOrDelete}
					isOwner={isOwner}
					loading={loading}
					idPublication={idPublication}
					id={id}
					comments={comments}
					commentsError={commentsError}
					succesRoles={succesRoles}
					currentUserId={currentUserId}
					currentUserIdRole={currentUserIdRole}
					onDeleteComment={onDeleteComment}
					handleSubmitComment={handleSubmitComment}
					handleSubmitSaveComment={handleSubmitSaveComment}
					id_author_publication={id_author_publication}
					avatarAuthor={avatarAuthor}
					isRemoving={isRemoving}
				/>
				<ConfirmModal
					isOpen={showDeleteModal}
					onClose={() => setShowDeleteModal(false)}
					onConfirm={confirmDelete}
					title="Удаление комментария"
					message="Вы действительно хотите удалить этот комментарий? Это действие необратимо."
					confirmText="Да, удалить"
					cancelText="Отмена"
					variant="danger"
				/>
				<ConfirmModal
					isOpen={warningModal.open}
					onClose={() => setWarningModal({ open: false, message: '' })}
					onConfirm={() => setWarningModal({ open: false, message: '' })}
					title="Предупреждение"
					message={warningModal.message}
					confirmText="ОК"
					cancelText={null}
					variant="warning"
					singleButton={true}
				/>
			</>
		);
	},
);
