import { NavLink } from 'react-router-dom';
import styles from './authorization.module.css';
import { Button } from '../../../../shared/ui-kit/button';
export const Authorization = () => {
	return (
		<NavLink to="/login">
			<Button className={styles.authorization}>АВТОРИЗАЦИЯ</Button>
		</NavLink>
	);
};
