import { Button } from '../../../../shared/ui-kit/button';
import { useState } from 'react';
import styles from './search.module.css';
import { memo, useCallback } from 'react';
import { Search } from 'lucide-react';

export const SearchComponent = memo(({ inputValue, setInputValue }) => {
	const [isFocused, setIsFocused] = useState(false);

	const handleChange = useCallback(
		(e) => {
			const value = e.target.value;
			setInputValue(value);
		},
		[setInputValue],
	);

	return (
		<>
			<div className={styles.form}>
				<input
					type="text"
					className={`${styles.input}  ${isFocused ? styles.focus : ''}`}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder="Поиск"
					value={inputValue}
					onChange={handleChange}
				/>
				<Button className={`${styles.button} ${isFocused ? styles.focus : ''}`}>
					<Search size={18}/>
				</Button>
			</div>
		</>
	);
});
