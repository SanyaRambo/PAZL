import styles from './topHeader.module.css';
import { Authorization, Registration, HeaderProfile, SearchComponent } from './components';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../entities/user-entite/selectors';
import { Button } from '../../shared/ui-kit/button';
import { ROLE } from '../../shared/constants';
import { useMatch } from 'react-router-dom';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const TopHeader = memo(({ inputValue, setInputValue }) => {
	const idRole = useSelector(selectUserRole);
	const navigate = useNavigate();

	const isActiveURLUsersList = useMatch(`/friends-and-communities/*`);
	const isActiveURLPublications = useMatch(`/publications/`);
	const isActiveGeneralPage = useMatch('/')

	const isInDesiredSection = !!isActiveURLPublications || isActiveURLUsersList;

	const onClickBack = () => {
		navigate(-1);
	};

	return (
		<div className={styles.topHeader}>
			<div className={styles.blockButtonBack}>
				<Button className={`${styles.buttonBack} ${isActiveGeneralPage ? styles.buttonDisabled : ''}`}
				onClick={onClickBack}
				disabled={isActiveGeneralPage}
				>
				<ChevronLeft />
			</Button>
			</div>
			<div className={styles.blockSearch}>
				{isInDesiredSection ? (
					<SearchComponent inputValue={inputValue} setInputValue={setInputValue} />
				) : (
					''
				)}
			</div>
			{idRole === ROLE.GUEST ? (
				<div className={styles.blockAutRegProf}>
					<Authorization />
					<Registration />
				</div>
			) : (
				<div className={styles.blockProfile}>
					<HeaderProfile />
				</div>
			)}
		</div>
	);
});
