import { useState, useEffect } from 'react';

export function useDebounce(value) {
	const [debouncedValue, setDebouncedValue] = useState('');


	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, 1000);

		return () => {
			clearTimeout(handler);
		};
	}, [value]);

	return debouncedValue;
}
