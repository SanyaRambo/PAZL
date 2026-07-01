import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
	selectUserLogin,
	selectUserId,
	selectUserAvatar,
} from '../../../../entities/user-entite/selectors';
import { getColorById } from '../../../../shared/utils/getColorById';
import styles from './headerProfile.module.css';
import { UserRound } from 'lucide-react';

export const HeaderProfile = () => {
	const login = useSelector(selectUserLogin);
	const userId = useSelector(selectUserId);
	const userAvatar = useSelector(selectUserAvatar);

	return (
		<NavLink
			to={`/profile-user/${userId}`}
			className={styles.profileLink}
			style={{
				background: `linear-gradient(195deg, ${getColorById(userId)}, ${getColorById(userId + '100')})`,
			}}
		>
			<div className={styles.avatarWrapper}>
				{userAvatar ? (
					<img
						src={userAvatar}
						alt={login}
						className={styles.avatarImage} 
					/>
				) : (
					<div
						style={{
							background: `linear-gradient(135deg, ${getColorById(userId)}, ${getColorById(userId + '1')})`,
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: '50%',
						}}
					>
						<UserRound size={26} strokeWidth={1.2} />
					</div>
				)}
			</div>
			<h3 className={styles.login}>{login}</h3>
		</NavLink>
	);
};
