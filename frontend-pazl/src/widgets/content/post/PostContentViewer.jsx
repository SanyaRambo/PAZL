import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import TextAlign from '@tiptap/extension-text-align';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { useEffect } from 'react';

export const PostContentViewer = ({ content }) => {
	const lowlight = createLowlight();
	lowlight.register('javascript', javascript);
	lowlight.register('css', css);
	lowlight.register('html', xml);

	let parsedContent = content;
	if (typeof content === 'string') {
		try {
			parsedContent = JSON.parse(content);
		} catch (e) {
			console.error('Failed to parse content JSON', e);
			parsedContent = '<p>Ошибка отображения контента</p>';
		}
	} else if (content && typeof content === 'object') {
		parsedContent = content;
	} else {
		parsedContent = '<p>Контент отсутствует</p>';
	}

	const editor = useEditor({
		extensions: [
			StarterKit.configure({ codeBlock: false }),
			CodeBlockLowlight.configure({
				lowlight,
				defaultLanguage: 'javascript',
			}),
			Image,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
		],
		content: parsedContent,
		editable: false,
	});

	useEffect(() => {
		if (editor) {
			// Даём время на рендер, затем подсвечиваем все блоки кода
			setTimeout(() => {
				document.querySelectorAll('.content pre code').forEach((block) => {
					hljs.highlightElement(block);
				});
			}, 50);
		}
	}, [editor]);

	if (!editor) return null;
	return <EditorContent editor={editor} />;
};
