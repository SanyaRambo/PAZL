import { NavLink } from 'react-router-dom';
import { Icon } from '../../../../shared/ui-kit/icon';
import styles from './options.module.css'

export const Options = () => {
	return (
		<div className={styles.options}>
			<Icon linkName='/options' iconName='fa-cog' />
		</div>
	);
};
