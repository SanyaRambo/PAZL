import { forwardRef, useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../../../shared/ui-kit/button';
import styles from './formSendMessage.module.css';

export const FormSendMessage = forwardRef(
	(
		{
			loading,
			isSending,
			comment,
			onChange,
			onSubmit,
			classNameForm = '',
			classNameTextarea = '',
			classNameFocus = '',
			classNameButton = '',
			firstWordSubmit,
			SecondWordSubmit,
			setIsStatus = () => {},
			isStatus = '',
			type = '',
			name = '',
			maxLength = 2000,
		},
		externalRef,
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const internalRef = useRef(null);
		const textareaRef = externalRef || internalRef;

		const autoResize = useCallback(() => {
			const textarea = textareaRef.current;
			if (!textarea) return;
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}, [textareaRef]);

		useEffect(() => {
			autoResize();
		}, [comment, autoResize]);

		useEffect(() => {
			autoResize();
		}, [autoResize]);

		if (loading) {
			return <h2>Загрузка комментариев...</h2>;
		}

		const isOverLimit = comment.length > maxLength;

		return (
			<form
				onSubmit={(event) => {
					onSubmit(event, comment, null);
					setIsStatus(isStatus);
				}}
				className={classNameForm}
			>
				{/* ✅ Обёртка для textarea + счётчика */}
				<div className={styles.inputGroup}>
					<textarea
						name={name}
						className={`${classNameTextarea} ${isFocused ? classNameFocus : ''} ${isOverLimit ? styles.overLimit : ''}`}
						placeholder="Напишите комментарий..."
						value={comment}
						type={type}
						onChange={onChange}
						disabled={isSending}
						ref={textareaRef}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
					/>
					<div className={styles.counterWrapper}>
						<span
							className={`${styles.counter} ${isOverLimit ? styles.overLimitText : ''}`}
						>
							{comment.length} / {maxLength}
						</span>
					</div>
				</div>
				<Button
					type="submit"
					disabled={isSending || !comment.trim() || isOverLimit}
					className={classNameButton}
				>
					{isSending ? `${firstWordSubmit}` : `${SecondWordSubmit}`}
				</Button>
				<span></span>
			</form>
		);
	},
);
