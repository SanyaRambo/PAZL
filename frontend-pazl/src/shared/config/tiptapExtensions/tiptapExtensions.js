import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import DragHandle from '@tiptap/extension-drag-handle';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';

const lowlight = createLowlight();
lowlight.register('javascript', javascript);
lowlight.register('css', css);
lowlight.register('html', xml);

export const tiptapExtensions = (placeholder = 'Начните писать...') => [
	StarterKit.configure({ codeBlock: false }),
	CodeBlockLowlight.configure({ lowlight, defaultLanguage: 'javascript' }),
	Placeholder.configure({ placeholder }),
	TextAlign.configure({ types: ['heading', 'paragraph'] }),
	Image,
	DragHandle,
];
