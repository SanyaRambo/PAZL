import { useCallback } from 'react';

export const useImagePasteDrop = (uploadFile) => {
	const handlePaste = useCallback(
		(view, event) => {
			const items = event.clipboardData?.items;
			if (!items) return false;
			let imageFile = null;
			for (let i = 0; i < items.length; i++) {
				if (items[i].type.startsWith('image/')) {
					imageFile = items[i].getAsFile();
					break;
				}
			}
			if (imageFile) {
				event.preventDefault();
				uploadFile(imageFile)
					.then((url) => {
						const { state } = view;
						const { tr } = state;
						const node = state.schema.nodes.image.create({ src: url });
						const transaction = tr.replaceSelectionWith(node);
						view.dispatch(transaction);
					})
					.catch(console.error);
				return true;
			}
			return false;
		},
		[uploadFile],
	);

	const handleDrop = useCallback(
		(view, event) => {
			const files = event.dataTransfer?.files;
			if (!files) return false;
			let imageFile = null;
			for (let i = 0; i < files.length; i++) {
				if (files[i].type.startsWith('image/')) {
					imageFile = files[i];
					break;
				}
			}
			if (imageFile) {
				event.preventDefault();
				uploadFile(imageFile)
					.then((url) => {
						const { state } = view;
						const { tr } = state;
						const node = state.schema.nodes.image.create({ src: url });
						const transaction = tr.replaceSelectionWith(node);
						view.dispatch(transaction);
					})
					.catch(console.error);
				return true;
			}
			return false;
		},
		[uploadFile],
	);

	return { handlePaste, handleDrop };
};
