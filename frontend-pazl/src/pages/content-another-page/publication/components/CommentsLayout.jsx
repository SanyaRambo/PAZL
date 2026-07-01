import { useSelector } from 'react-redux';
import { getCommentWord } from '../../../../shared/lib/get-comment-word';
import { useRequestServer, useMutation } from '../../../../shared/hooks';
import { Error, Loader } from '../../../../widgets/server-status';
import {
	selectUserId,
} from '../../../../entities/user-entite/selectors';
import { selectUserRole } from '../../../../entities/user-entite/selectors';
import { CommentsTree } from './components/CommentsTree';
import { ROLE } from '../../../../shared/constants';
import { useState, memo } from 'react';
import { FormSendMessage } from '../../../../widgets/content/form/FormSendMessage';
import styles from './inputComment.module.css'


export const CommentsLayout = memo(({ idPublication, idAuthor, loading, isSending, comment, handleInputChange, handleSubmitComment, commentsError, comments, succesRoles, currentUserId, onDeleteComment, currentUserIdRole, handleSubmitSaveComment }) => {

	return (
		<div>
			<FormSendMessage
			loading={loading}
			isSending={isSending}
			comment={comment}
			onChange={handleInputChange}
			onSubmit={handleSubmitComment}
			classNameForm={styles.commentForm}
			classNameTextarea={styles.textarea}
			classNameFocus={styles.focused}
			classNameButton={styles.submitButton}
			firstWordSubmit={'Отправка...'}
			name={'mainForm'}
			SecondWordSubmit={'Отправить комментарий'}
			/>
			<h2>
				{' '}
				{(Array.isArray(comments) ? comments.length : 0) === 0
					? 'Нет'
					: Array.isArray(comments)
						? comments.length
						: 0}{' '}
				{getCommentWord(Array.isArray(comments) ? comments.length : 0)}
			</h2>
			{loading || !comments ? (
				<Loader />
			) : commentsError ? (
				<Error error={commentsError} />
			) : (
				comments?.map(
					(commentItem) =>
						!commentItem.idParent && (
							<CommentsTree
								key={commentItem.id}
								comments={comments}
								comment={comment}
								commentsError={commentsError}
								succesRoles={succesRoles}
								currentUserId={currentUserId}
								currentUserIdRole={currentUserIdRole}
								onDeleteComment={onDeleteComment}
								handleSubmitSaveComment={handleSubmitSaveComment}
								handleSubmitComment={handleSubmitComment}
								isSending={isSending}
								id_author_publication={idAuthor}
								id={commentItem.id}
								idAuthor={commentItem.idAuthor}
								idParent={commentItem.idParent}
								publishedAt={commentItem.
								publishedAt}
								text={commentItem.text}
								author={commentItem.author}
								avatarAuthor={commentItem.avatarAuthor}
								edited={commentItem.editedAt}
								loading={loading}
								idPublication={idPublication}
							/>
						),
				)
			)}

		</div>
	);
});
