import { useEditor, EditorContent } from '@tiptap/react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../../../../shared/ui-kit/button';
import FileHandler from '@tiptap/extension-file-handler';
import { Toolbar } from './Toolbar';

import {
	selectEditingPost,
	selectIsDirty,
} from '../../../../entities/editor-entite/selectors';
import Placeholder from '@tiptap/extension-placeholder';
import {
	updateEditingPost,
	clearEditingPost,
	deletePostAsync,
} from '../../../../entities/editor-entite/actions';
import { togglePublishPost } from '../../../../entities/editor-entite/actions/toggle-published-post';
import { useCallback, useEffect, useState } from 'react'; 
import styles from './richTextEditor.module.css';
import { useNavigate } from 'react-router-dom';
import { tiptapExtensions } from '../../../../shared/config/tiptapExtensions/tiptapExtensions';
import { useAutoSave, useImagePasteDrop } from '../../../../shared/hooks';
import { Trash2, MonitorUpIcon, MonitorXIcon, X, AirplayIcon } from 'lucide-react';
import { ConfirmModal } from '../../../../widgets/modal-window/confirm-modal';

export const RichTextEditor = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isDirty = useSelector(selectIsDirty);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const editingPost = useSelector(selectEditingPost);
	const content = editingPost?.content || '<p>Начните писать...</p>';

	const uploadFile = useCallback(async (file) => {
		const formData = new FormData();
		formData.append('image', file);
		const res = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
			credentials: 'include',
		});
		const data = await res.json();
		if (data.res && data.res.url) return data.res.url;
		throw new Error(data.error || 'Upload failed');
	}, []);

	const { handlePaste, handleDrop } = useImagePasteDrop(uploadFile);

	const editor = useEditor({
		extensions: tiptapExtensions('Начните писать...'),
		content: content,
		editorProps: {
			handlePaste,
			handleDrop,
		},
		onUpdate: ({ editor }) => {
			const json = editor.getJSON();
			dispatch(updateEditingPost({ content: json }));
		},
	});

	useAutoSave(editingPost, isDirty);

	useEffect(() => {
		if (editor && editingPost?.id) {
			editor.commands.setContent(editingPost.content);
		}
	}, [editingPost?.id, editor]);

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('image', file);

		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
				credentials: 'include',
			});
			const data = await res.json();
			if (data.res && data.res.url) {
				dispatch(updateEditingPost({ image: data.res.url }));
			} else {
				console.error('Ошибка загрузки:', data.error);
			}
		} catch (err) {
			console.error('Сетевая ошибка:', err);
		}
	};


	const handleDeleteClick = () => {
		setShowDeleteModal(true);
	};


	const confirmDelete = () => {
		setShowDeleteModal(false);
		if (editingPost?.id) {
			dispatch(deletePostAsync(editingPost.id));
		}
	};

	if (!editingPost) {
		return (
			<div className={styles.statusEditor}>Выберите пост или создайте новый...</div>
		);
	}

	return (
		<>
			<div className={styles.editorCard}>
				<div className={styles.actionButtons}>
					<div className={styles.leftAction}>
						<Button
							className={`${styles.actionButton} ${styles.actionButtonDanger}`}
							onClick={handleDeleteClick}
							title="Удалить пост"
						>
							<Trash2 size={20} strokeWidth={1.5} />
						</Button>
						<Button
							className={`${styles.actionButton} ${styles.actionButtonSuccess}`}
							onClick={() => dispatch(togglePublishPost())}
							title={
								editingPost.isPublished
									? 'Снять с публицаии'
									: 'Опубликовать'
							}
						>
							{editingPost.isPublished ? (
								<MonitorXIcon size={20} strokeWidth={1.5} />
							) : (
								<MonitorUpIcon size={20} strokeWidth={1.5} />
							)}
						</Button>
						<Button
							className={`${styles.actionButton} ${styles.actionButtonSuccess} ${
								editingPost.isPublished ? '' : styles.actionButtonHidden
							}`}
							onClick={() => navigate(`/publications/${editingPost.id}`)}
							title="Перейти на страницу публикации"
						>
							<AirplayIcon size={20} strokeWidth={1.5} />
						</Button>
					</div>

					<Button
						className={styles.actionButton}
						onClick={() => dispatch(clearEditingPost())}
						title="Закрыть окно с публикацией"
					>
						<X size={20} strokeWidth={1.5} />
					</Button>
				</div>

				<input
					className={styles.inputField}
					type="text"
					value={editingPost.title || ''}
					onChange={(e) =>
						dispatch(updateEditingPost({ title: e.target.value }))
					}
					placeholder="Заголовок (макс 60 символов)"
				/>

				<div className={styles.imageUploadArea}>
					<label className={styles.imageLabel}>Обложка (превью)</label>
					<input
						className={styles.inputField}
						type="text"
						value={editingPost.image || ''}
						onChange={(e) =>
							dispatch(updateEditingPost({ image: e.target.value }))
						}
						placeholder="URL картинки"
					/>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageUpload}
						style={{ marginTop: '8px' }}
					/>
					{editingPost.image && (
						<img
							src={editingPost.image}
							alt="превью"
							className={styles.imagePreview}
						/>
					)}
				</div>
				<Toolbar editor={editor} uploadFile={uploadFile} />
				<div className={styles.editorContent}>
					<EditorContent editor={editor} />
				</div>
			</div>
			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={confirmDelete}
				title="Удаление поста"
				message={`Вы действительно хотите удалить пост "${editingPost.title || 'Без названия'}"? Это действие необратимо.`}
				confirmText="Да, удалить"
				cancelText="Отмена"
				variant="danger"
			/>
		</>
	);
};
