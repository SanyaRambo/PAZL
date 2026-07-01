import { useDispatch, useSelector } from 'react-redux';
import { setCommentLike } from '../../../../entities/likes-entite/actions';
import { useRequestServer, useMutation } from '../../../../shared/hooks';
import { Error, Loader } from '../../../../widgets/server-status';
import { selectUserId } from '../../../../entities/user-entite/selectors';
import { selectUserRole } from '../../../../entities/user-entite/selectors';
import { CommentsTree } from './components/CommentsTree';
import { ROLE } from '../../../../shared/constants';
import { useState, memo, useEffect } from 'react';
import { FormSendMessage } from '../../../../widgets/content/form/FormSendMessage';
import { CommentsLayout } from './CommentsLayout';

export const Comments = memo(({ idPublication, idAuthor }) => {
	const [comment, setComment] = useState('');
	const [isSending, setIsSending] = useState(false);

	const dispatch = useDispatch();

	const succesRoles = [ROLE.ADMIN, ROLE.MODERATOR];

	const currentUserId = useSelector(selectUserId);
	const currentUserIdRole = useSelector(selectUserRole);

	const {
		data: comments,
		error: commentsError,
		loading,
		refetch,
	} = useRequestServer(`/api/publications/${idPublication}/comments`, 'GET');

	const { mutate: sendCommentOnServe } = useMutation();
	const { mutate: deleteCommentOnServe } = useMutation();
	const { mutate: saveCommentOnServe } = useMutation();

	const handleSubmitComment = async (event, text, idParent) => {
		event.preventDefault();

		if (!text.trim() || isSending) return;

		setIsSending(true);

		const result = await sendCommentOnServe(
			`/api/publications/${idPublication}/comments`,
			'POST',
			{ text, idParent },
		);

		setIsSending(false);

		if (result.success) {
			setComment('');
			refetch();
		} else {
			console.log(`Ошибка: ${result.error}`);
			alert(result.error);
		}
	};

	const handleInputChange = ({ target }) => {
		setComment(target.value);
	};

	const onDeleteComment = async (idComment) => {
		const result = await deleteCommentOnServe(
			`/api/publications/${idPublication}/comments/${idComment}`,
			'DELETE',
		);

		if (result.success) {
			await refetch();
			console.log('Комментарий успешно удалён');
		} else {
			console.log(`Ошибка: ${result.error}`);
		}
	};

	const handleSubmitSaveComment = async (idComment, commentEdit, event) => {
		event.preventDefault();
		const result = await saveCommentOnServe(
			`/api/publications/${idPublication}/comments/${idComment}`,
			'PATCH',
			{ commentEdit },
		);

		if (result.success) {
			await refetch();
			console.log('Комментарий успешно сохранён');
		} else {
			console.log(`Ошибка: ${result.error}`);
		}
	};

	useEffect(() => {
		if (Array.isArray(comments) && comments.length > 0) {
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
		}
	}, [comments, dispatch]);

	

	return (
		<CommentsLayout
			idPublication={idPublication}
			idAuthor={idAuthor}
			loading={loading}
			isSending={isSending}
			comment={comment}
			handleInputChange={handleInputChange}
			handleSubmitComment={handleSubmitComment}
			commentsError={commentsError}
			comments={comments}
			succesRoles={succesRoles}
			currentUserId={currentUserId}
			onDeleteComment={onDeleteComment}
			currentUserIdRole={currentUserIdRole}
			handleSubmitSaveComment={handleSubmitSaveComment}
		/>
	);
});
