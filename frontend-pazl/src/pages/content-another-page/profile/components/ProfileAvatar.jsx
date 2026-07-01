import { Loader } from '../../../../widgets/server-status';
import { Camera, UserRound, Upload, Link2 } from 'lucide-react';
import { getColorById } from '../../../../shared/utils/getColorById';
import styles from '../profilePage.module.css';

export const ProfileAvatar = ({
	avatar,
	login,
	isOwner,
	avatarLoading,
	avatarError,
	avatarUrl,
	setAvatarUrl,
	onFileSelect,
	onFileChange,
	onAvatarUrlSubmit,
	fileInputRef,
	id,
}) => {
	return (
		<div className={styles.avatarWrapperOuter}>
			<div className={styles.avatarContainer}>
				{avatar ? (
					<img src={avatar} alt={login} className={styles.avatar} />
				) : (
					<div
						className={styles.avatarPlaceholder}
						style={{
							background: `linear-gradient(135deg, ${getColorById(id)}, ${getColorById(id + '1')})`,
						}}
					>
						<UserRound size={160} strokeWidth={1} />
					</div>
				)}
			</div>

			{isOwner && (
				<div className={styles.avatarControls}>
					<div className={styles.avatarBtnGroup}>
						<button className={styles.avatarBtn} onClick={onFileSelect}>
							<Upload size={14} /> Загрузить
						</button>
						<input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							style={{ display: 'none' }}
							onChange={onFileChange}
						/>
					</div>
					<div className={styles.avatarUrlGroup}>
						<input
							type="text"
							placeholder="URL аватарки"
							value={avatarUrl}
							onChange={(e) => setAvatarUrl(e.target.value)}
							className={styles.avatarUrlInput}
						/>
						<button
							className={styles.avatarUrlSubmit}
							onClick={onAvatarUrlSubmit}
							disabled={avatarLoading}
						>
							{avatarLoading ? (
								<Loader className={styles.smallLoader} />
							) : (
								<Link2 size={14} />
							)}
						</button>
					</div>
					{avatarError && (
						<span className={styles.avatarError}>{avatarError}</span>
					)}
				</div>
			)}
		</div>
	);
};
