import styles from './sidebar.module.css';
import { LogoPazl } from '../../shared/assets/logo-png/logo';
import { ControlPanel, Options } from './components';
import { useSelector } from 'react-redux';
import { ROLE } from '../../shared/constants';
import { selectUserRole } from '../../entities/user-entite/selectors';

export const Sidebar = () => {
const idRole = useSelector(selectUserRole)

	return (
		<>
			<div className={styles.leftHeader}>
				<LogoPazl />
				<ControlPanel />

				{idRole === ROLE.GUEST ?
				<div></div> :
				<Options />
			}
			</div>
		</>
	);
};
