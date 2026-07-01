import styles from './controlPanel.module.css';
import { Icon } from '../../../../shared/ui-kit/icon';
import { ROLE } from '../../../../shared/constants';
import { useSelector } from 'react-redux';
import { selectUserRole} from '../../../../entities/user-entite/selectors';

export const ControlPanel = () => {
	const idRole = useSelector(selectUserRole);

	return (
		<div className={styles.contolPanel}>
			{idRole === ROLE.GUEST ? (
				<Icon linkName="/publications" iconName="fa-th-large" />
			) : (
				<>
					<Icon linkName="/workshop" iconName="fa-pencil-square-o" />
					<Icon linkName="/media-library" iconName="fa-book" />
					<Icon linkName="/time-management" iconName="fa-clock-o" />
					<Icon linkName="/publications" iconName="fa-th-large" />
					<Icon linkName="/friends-and-communities" iconName="fa-users" />
				</>
			)}
		</div>
	);
};
