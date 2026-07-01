import { request } from '../../../shared/utils/request';
import { updateEditingPost } from './update-editing-post';
import { updatePostInList } from '../../publications-entite/actions';
import toast from 'react-hot-toast';
import { getPlainTextFromJSON } from '../../../shared/utils/planTextJSON';
import { loadLikedPostsAsync, updateLikedPost } from '../../liked-posts-entite/actions';

export const togglePublishPost = () => async (dispatch, getState) => {
	const { post } = getState().editor;
	if (!post) return;

	const newStatus = !post.isPublished;

	// Валидация перед публикацией (только если пытаемся опубликовать)
	if (newStatus && !post.isPublished) {
		if (!post.title?.trim()) {
			toast.error('Заголовок не может быть пустым');
			return;
		}
		if (post.title.trim().length > 60) {
			toast.error('Заголовок не может превышать 60 символов');
			return;
		}
		if (!post.image?.trim()) {
			toast.error('Загрузите обложку');
			return;
		}
		const plainContent = getPlainTextFromJSON(post.content);
		if (!plainContent || plainContent.length < 10) {
			toast.error('Добавьте хотя бы 10 символов текста');
			return;
		}
	}

	try {
		const data = await request(`/api/publications/${post.id}/publish`, 'PATCH', {
			isPublished: newStatus,
		});
		if (data.error) throw new Error(data.error);
		dispatch(updateEditingPost({ isPublished: newStatus }));
		dispatch(
			updatePostInList({
				id: post.id,
				changes: { isPublished: newStatus, publishedAt: data.res.publishedAt },
			}),
		);
		dispatch(
			updateLikedPost({
				id: post.id,
				changes: { isPublished: newStatus, publishedAt: data.res.publishedAt },
			}),
		);
		dispatch(loadLikedPostsAsync());
		if (newStatus === true) {
			toast.success('Пост опубликован');
		} else {
			toast.success('Пост снят с публикации');
		}
	} catch (err) {
		console.error('Publish toggle failed', err);
		toast.error('Ошибка при изменении статуса публикации');
	}
};
