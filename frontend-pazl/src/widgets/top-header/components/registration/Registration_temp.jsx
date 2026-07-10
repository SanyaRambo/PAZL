import { NavLink } from 'react-router-dom';
import styles from './registration.module.css';
import { Button } from '../../../../shared/ui-kit/button';

export const Registration = () => {
	return (
		<NavLink to="/register">
			<Button className={styles.registration}>РЕГИСТРАЦИЯ</Button>
		</NavLink>
	);
};
