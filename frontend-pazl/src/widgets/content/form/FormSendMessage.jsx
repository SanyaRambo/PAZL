import { forwardRef, useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../../../shared/ui-kit/button';

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
		},
		externalRef, // переименовали ref во externalRef для ясности
	) => {
		const [isFocused, setIsFocused] = useState(false);
		const internalRef = useRef(null); // всегда вызываем useRef — соблюдаем правила хуков
		// Используем внешний ref, если передан, иначе — внутренний
		const textareaRef = externalRef || internalRef;

		// Функция авторазмера
		const autoResize = useCallback(() => {
			const textarea = textareaRef.current;
			if (!textarea) return;

			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}, [textareaRef]);

		// Обновляем высоту при изменении comment
		useEffect(() => {
			autoResize();
		}, [comment, autoResize]);

		// Инициализируем высоту при монтировании
		useEffect(() => {
			autoResize();
		}, [autoResize]);

		if (loading) {
			return <h2>Загрузка комментариев...</h2>;
		}

		return (
			<form
				onSubmit={(event) => {
					onSubmit(event, comment, null);
					setIsStatus(isStatus);
				}}
				className={classNameForm}
			>
				<textarea
					name={name}
					className={`${classNameTextarea} ${isFocused ? classNameFocus : ''}`}
					placeholder="Напишите комментарий..."
					value={comment}
					type={type}
					onChange={onChange}
					disabled={isSending}
					ref={textareaRef} 
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
				/>
				<Button
					type="submit"
					disabled={isSending || !comment.trim()}
					className={classNameButton}
				>
					{isSending ? `${firstWordSubmit}` : `${SecondWordSubmit}`}
				</Button>
			</form>
		);
	},
);
