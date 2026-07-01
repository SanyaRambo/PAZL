import styles from './logo.module.css';
import { NavLink } from 'react-router-dom';

export const LogoPazl = () => {
	return (
		<div className={styles.windowLogo}>
			<NavLink to="/">
				<img
					src="/logo/logo.png"
					alt="LogoPazl"
					className={styles.logoPazl}
				/>
			</NavLink>
		</div>
	);
};
