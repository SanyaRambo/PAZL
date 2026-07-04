import { request } from '../../../shared/utils/request';
import { updateEditingPost } from './update-editing-post';
import { updatePostInList } from '../../publications-entite/actions/update-post-in-list';
import { getPlainTextFromJSON } from '../../../shared/utils/planTextJSON';
import toast from 'react-hot-toast';

export const saveEditingPost = () => async (dispatch, getState) => {
	const { post, isDirty } = getState().editor;

	if (!post || !isDirty) return;

	if (post.title.length > 120 || post.title.length < 5) {
    toast.error('Заголовок не может превышать 120 символов и быть меньше 5 символов.');
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
	try {
		const data = await request(`/api/publications/${post.id}/content`, 'PATCH', {
			title: post.title,
			content: post.content,
			image: post.image,
		});
		if (data.error) throw new Error(data.error);

		dispatch(updateEditingPost({ isDirty: false }));
		dispatch(
			updatePostInList({
				id: post.id,
				changes: { title: post.title, content: post.content, image: post.image },
			}),
		);
	} catch (err) {
		console.error('Auto-save failed', err);
	}
};
