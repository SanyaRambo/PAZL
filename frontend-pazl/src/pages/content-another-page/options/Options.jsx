import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	selectUserId,
	selectUserLogin,
	selectUserAvatar,
	selectUserTheme,
} from '../../../entities/user-entite/selectors';
import { setUser } from '../../../entities/user-entite/actions';
import { request } from '../../../shared/utils/request';
import { Loader } from '../../../widgets/server-status';
import { ConfirmModal } from '../../../widgets/modal-window/confirm-modal';
import { Camera, User, Moon, Sun } from 'lucide-react';
import styles from './options.module.css';
import { logout } from '../../../entities/app-entite/actions';

export const Options = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();


	const userId = useSelector(selectUserId);
	const currentLogin = useSelector(selectUserLogin);
	const currentAvatar = useSelector(selectUserAvatar);
	const currentTheme = useSelector(selectUserTheme);


	const [login, setLogin] = useState(currentLogin || '');
	const [avatar, setAvatar] = useState(currentAvatar || '');
	const [theme, setTheme] = useState(currentTheme || 'dark');
	const [avatarUrl, setAvatarUrl] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const fileInputRef = useRef(null);


	useEffect(() => {
		setLogin(currentLogin || '');
	}, [currentLogin]);

	useEffect(() => {
		setAvatar(currentAvatar || '');
	}, [currentAvatar]);

	useEffect(() => {
		setTheme(currentTheme || 'dark');
	}, [currentTheme]);

	if (userId === null) {
		return (
			<div className={styles.loaderContainer}>
				<Loader className={styles.spinner} />
			</div>
		);
	}


	const handleFileSelect = () => fileInputRef.current.click();

	const handleFileChange = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		const formData = new FormData();
		formData.append('image', file);
		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
				credentials: 'include',
			});
			const data = await res.json();
			if (data.res && data.res.url) {
				setAvatar(data.res.url);
			} else {
				setError('Ошибка загрузки аватарки');
			}
		} catch (err) {
			setError('Сетевая ошибка', err);
		}
	};

	const handleAvatarUrlSubmit = () => {
		if (avatarUrl.trim()) {
			setAvatar(avatarUrl.trim());
			setAvatarUrl('');
		}
	};


	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess(false);

		try {
			const payload = {
				login: login.trim(),
				avatar: avatar || null,
				theme: theme,
			};
			const result = await request('/api/profile-user', 'PATCH', payload);
			if (result.error) {
				throw new Error(result.error);
			}
			if (payload.login.length < 3) {
				throw new Error('Логин должен быть не меньше 3 символов');
			}
			dispatch(setUser({ ...result.res }));

			document.body.className = theme === 'light' ? 'light-theme' : 'dark-theme';
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} catch (err) {
			setError(err.message || 'Ошибка сохранения');
		} finally {
			setLoading(false);
		}
	};


	const handleDeleteProfile = () => {
		setShowDeleteModal(true);
	};


	const confirmDeleteProfile = async () => {
		setShowDeleteModal(false);
		setLoading(true);
		try {
			const result = await request('/api/profile-user', 'DELETE');
			if (result.error) throw new Error(result.error);
			dispatch(logout());
			document.body.className = 'dark-theme';
			navigate('/');
		} catch (err) {
			setError(err.message || 'Ошибка удаления профиля');
			setLoading(false);
		}
	};

	return (
		<div className={styles.settingsPage}>
			<h1 className={styles.title}>Настройки</h1>
			<form onSubmit={handleSubmit} className={styles.form}>
				<div className={styles.avatarSection}>
					<div className={styles.avatarWrapper}>
						{avatar ? (
							<img src={avatar} alt="Аватар" className={styles.avatar} />
						) : (
							<div className={styles.avatarPlaceholder}>
								<User size={40} />
							</div>
						)}
					</div>
					<div className={styles.avatarControls}>
						<button
							type="button"
							className={styles.saveBtn}
							onClick={handleFileSelect}
						>
							<Camera size={16} /> Загрузить
						</button>
						<input
							type="file"
							accept="image/*"
							ref={fileInputRef}
							style={{ display: 'none' }}
							onChange={handleFileChange}
						/>
						<div className={styles.avatarUrlGroup}>
							<input
								type="text"
								placeholder="URL аватарки"
								value={avatarUrl}
								onChange={(e) => setAvatarUrl(e.target.value)}
								className={styles.urlInput}
							/>
							<button
								type="button"
								className={styles.urlSubmit}
								onClick={handleAvatarUrlSubmit}
							>
								OK
							</button>
						</div>
					</div>
				</div>

				<div className={styles.field}>
					<label>Логин</label>
					<input
						type="text"
						value={login}
						onChange={(e) => setLogin(e.target.value)}
						placeholder="Введите новый логин"
						required
					/>
				</div>

				<div className={styles.field}>
					<label>Цветовая тема</label>
					<div className={styles.themeSelector}>
						<button
							type="button"
							className={`${styles.themeBtn} ${theme === 'dark' ? styles.active : ''}`}
							onClick={() => setTheme('dark')}
						>
							<Moon size={18} /> Тёмная
						</button>
						<button
							type="button"
							className={`${styles.themeBtn} ${theme === 'light' ? styles.active : ''}`}
							onClick={() => setTheme('light')}
						>
							<Sun size={18} /> Светлая
						</button>
					</div>
				</div>

				{error && <div className={styles.error}>{error}</div>}
				{success && <div className={styles.success}>Настройки сохранены!</div>}

				<div className={styles.buttons}>
					<button type="submit" className={styles.saveBtn} disabled={loading}>
						{loading ? 'Сохранение...' : 'Сохранить'}
					</button>
					<button
						type="button"
						className={styles.deleteBtn}
						onClick={handleDeleteProfile}
						disabled={loading}
					>
						Удалить профиль
					</button>
				</div>
			</form>
			<ConfirmModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={confirmDeleteProfile}
				title="Удаление профиля"
				message="Вы действительно хотите удалить свой профиль? Это действие необратимо, и все ваши данные будут потеряны."
				confirmText="Да, удалить"
				cancelText="Отмена"
				variant="danger"
			/>
		</div>
	);
};
