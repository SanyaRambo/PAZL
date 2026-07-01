export const getCommentWord = (count) => {
	// Если count не число или не целое, возвращаем пустую строку или ошибку
	if (typeof count !== 'number' || !Number.isInteger(count)) {
		return '';
	}

	// Получаем две последние цифры числа (для проверки на 11-14)
	const lastTwoDigits = count % 100;

	// Получаем последнюю цифру числа
	const lastDigit = count % 10;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return 'комментариев';
	}


	if (lastDigit === 1) {
		return 'комментарий'; // 1, 21, 31, 101...
	} else if (lastDigit >= 2 && lastDigit <= 4) {
		return 'комментария'; // 2, 3, 4, 22, 23, 24...
	} else {
		return 'комментариев'; // 0, 5-9, 10-20...
	}
};
