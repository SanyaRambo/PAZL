import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Heading1,
	Heading2,
	Undo,
	Redo,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Quote,
	Code2,
	Image as ImageIcon,
	Upload,
} from 'lucide-react';
import styles from './richTextEditor.module.css';
import { useRef } from 'react';

export const Toolbar = ({ editor, uploadFile }) => {
	const fileInputRef = useRef();
	if (!editor) return null;

	const addImage = () => {
		const url = window.prompt('Введите URL изображения:');
		if (url) editor.chain().focus().setImage({ src: url }).run();

	};

	const handleFileUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		try {
			const url = await uploadFile(file);
			editor.chain().focus().setImage({ src: url }).run();
		} catch (err) {
			console.error('Upload failed', err);
		}
		e.target.value = '';
	};

	return (
		<div className={styles.toolbar}>
			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				className={editor.isActive('bold') ? styles.isActive : ''}
			>
				<Bold size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				className={editor.isActive('italic') ? styles.isActive : ''}
			>
				<Italic size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				className={
					editor.isActive('heading', { level: 1 }) ? styles.isActive : ''
				}
			>
				<Heading1 size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				className={
					editor.isActive('heading', { level: 2 }) ? styles.isActive : ''
				}
			>
				<Heading2 size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={editor.isActive('bulletList') ? styles.isActive : ''}
			>
				<List size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className={editor.isActive('orderedList') ? styles.isActive : ''}
			>
				<ListOrdered size={18} />
			</button>
			<button onClick={addImage}>
				<ImageIcon size={18} />
			</button>
			<input
				type="file"
				accept="image/*"
				ref={fileInputRef}
				style={{ display: 'none' }}
				onChange={handleFileUpload}
			/>
			<button onClick={() => fileInputRef.current.click()}>
				<Upload size={18} />{' '}
			</button>
			<button onClick={() => editor.chain().focus().undo().run()}>
				<Undo size={18} />
			</button>
			<button onClick={() => editor.chain().focus().redo().run()}>
				<Redo size={18} />
			</button>
			<div className={styles.divider} />
			<button
				onClick={() => editor.chain().focus().setTextAlign('left').run()}
				className={editor.isActive({ textAlign: 'left' }) ? styles.isActive : ''}
			>
				<AlignLeft size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().setTextAlign('center').run()}
				className={
					editor.isActive({ textAlign: 'center' }) ? styles.isActive : ''
				}
			>
				<AlignCenter size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().setTextAlign('right').run()}
				className={editor.isActive({ textAlign: 'right' }) ? styles.isActive : ''}
			>
				<AlignRight size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().setTextAlign('justify').run()}
				className={
					editor.isActive({ textAlign: 'justify' }) ? styles.isActive : ''
				}
			>
				<AlignJustify size={18} />
			</button>

			<div className={styles.divider} />
			<button
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				className={editor.isActive('blockquote') ? styles.isActive : ''}
			>
				<Quote size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleCodeBlock().run()}
				className={editor.isActive('codeBlock') ? styles.isActive : ''}
			>
				<Code2 size={18} />
			</button>
		</div>
	);
};
