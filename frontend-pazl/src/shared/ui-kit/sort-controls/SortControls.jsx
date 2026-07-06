import { memo } from 'react';
import styles from './sortControls.module.css';

export const SortControls = memo(({ options, value, onChange, label }) => {
	return (
		<div className={styles.sortControls}>
			{label && <span className={styles.label}>{label}</span>}
			<select
				className={styles.select}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
});
