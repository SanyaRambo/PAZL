import { useEffect, useMemo } from 'react';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { saveEditingPost } from '../../entities/editor-entite/actions';

export const useAutoSave = (editingPost, isDirty) => {
	const dispatch = useDispatch();
	const debouncedSave = useMemo(
		() => debounce(() => dispatch(saveEditingPost()), 800),
		[dispatch],
	);

	useEffect(() => {
		if (editingPost && isDirty && editingPost.id) {
			debouncedSave();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		editingPost?.title,
		editingPost?.content,
		editingPost?.image,
		isDirty,
		debouncedSave,
	]);

	return null;
};
