import { useDispatch, useSelector } from 'react-redux';
import { selectUserId } from '../../../../entities/user-entite/selectors';
import { selectUserRole } from '../../../../entities/user-entite/selectors';
import { ROLE } from '../../../../shared/constants';
import { useState, memo, useEffect, useRef } from 'react';
import { CommentsLayout } from './CommentsLayout';
import {
	loadComments,
	addCommentThunk,
	deleteCommentThunk,
	updateCommentThunk,
} from '../../../../entities/comments-entite';
import {
	selectComments,
	selectCommentsLoading,
	selectCommentsError,
} from '../../../../entities/comments-entite';
import { setCommentLike } from '../../../../entities/likes-entite/actions';
import { ConfirmModal } from '../../../../widgets/modal-window/confirm-modal';

export const Comments = memo(({ idPublication, idAuthor }) => {
	const dispatch = useDispatch();
	const [comment, setComment] = useState('');
	const [isSending, setIsSending] = useState(false);
	const [warningModal, setWarningModal] = useState({ open: false, message: '' });

	const currentUserId = useSelector(selectUserId);
	const currentUserIdRole = useSelector(selectUserRole);
	const comments = useSelector((state) => selectComments(state, idPublication));
	const loading = useSelector(selectCommentsLoading);
	const error = useSelector(selectCommentsError);
	const MAX_COMMENT_LENGTH = 2000;

	const succesRoles = [ROLE.ADMIN, ROLE.MODERATOR];
	const initializedRef = useRef(false);

	useEffect(() => {
		dispatch(loadComments(idPublication, 'publishedAt', 'asc'));
	}, [dispatch, idPublication]);

	useEffect(() => {
		if (!initializedRef.current && Array.isArray(comments) && comments.length > 0) {
			comments.forEach((comment) => {
				dispatch(
					setCommentLike(comment.id, {
						likesCount: comment.likesCount,
						dislikesCount: comment.dislikesCount,
						isLiked: comment.isLiked,
						isDisliked: comment.isDisliked,
					}),
				);
			});
			initializedRef.current = true;
		}
	}, [comments, dispatch]);

	const showWarning = (message) => {
		setWarningModal({ open: true, message });
	};

	const handleSubmitComment = async (event, text, idParent) => {
		event.preventDefault();
		if (!text.trim() || isSending) return;
		if (text.length > MAX_COMMENT_LENGTH) {
			showWarning(`Комментарий не может превышать ${MAX_COMMENT_LENGTH} символов.`);
			return;
		}
		setIsSending(true);
		await dispatch(addCommentThunk(idPublication, text, idParent));
		setComment('');
		setIsSending(false);
	};

	const handleInputChange = ({ target }) => {
		setComment(target.value);
	};

	const onDeleteComment = async (idComment) => {
		await dispatch(deleteCommentThunk(idPublication, idComment));
	};

	const handleSubmitSaveComment = async (idComment, commentEdit, event) => {
		event.preventDefault();
		await dispatch(updateCommentThunk(idPublication, idComment, commentEdit));
	};

	return (
		<>
			<CommentsLayout
				idPublication={idPublication}
				idAuthor={idAuthor}
				loading={loading}
				isSending={isSending}
				comment={comment}
				handleInputChange={handleInputChange}
				handleSubmitComment={handleSubmitComment}
				commentsError={error}
				comments={comments}
				succesRoles={succesRoles}
				currentUserId={currentUserId}
				onDeleteComment={onDeleteComment}
				currentUserIdRole={currentUserIdRole}
				handleSubmitSaveComment={handleSubmitSaveComment}
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
});
