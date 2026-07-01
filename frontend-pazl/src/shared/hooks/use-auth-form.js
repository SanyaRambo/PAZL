import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { regFormSchema } from '../schema/shema-registration';
import { authFormSchema } from '../schema/schema-authorization';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWasLogout } from '../../entities/app-entite/selectors';
import { setUser } from '../../entities/user-entite/actions';
import { useNavigate } from 'react-router-dom';
import { useResetForm } from './use-reset-form';
import { request } from '../utils/request';

export const useAuthForm = (type) => {
	const [serverError, setServerError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const wasLogout = useSelector(selectWasLogout);

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors, isValid, isSubmitted },
		setFocus,
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
			replayPassword: '',
		},
		mode: 'onChange',
		resolver: yupResolver(type === 'registration' ? regFormSchema : authFormSchema),
		shouldValidate: true,
	});

	useResetForm(wasLogout, reset, setServerError);

	const onSubmit = async ({ login, password, replayPassword }) => {
		setIsSubmitting(true);
		setServerError('');

		try {
			if (type === 'registration') {
				const { error, user } = await request('/api/register', 'POST', {
					login,
					password,
					replayPassword,
				});

				if (error) {
					setServerError(`Ошибка регистрации: ${error}`);
					setFocus('login');
					return;
				}

				dispatch(setUser(user));
				console.log(user)
				const theme = user.theme || 'dark';
				document.body.className =
					theme === 'light' ? 'light-theme' : 'dark-theme';
				reset();
				navigate('/');
			} else {
				const { error, user } = await request('/api/login', 'POST', {
					login,
					password,
				});
				if (error) {
					setServerError(`Ошибка авторизации: ${error}`);
					setFocus('login');
					return;
				}

				dispatch(setUser(user));
				const theme = user.theme || 'dark';
				document.body.className =
					theme === 'light' ? 'light-theme' : 'dark-theme';
				reset();
				navigate('/');
			}
		} catch (err) {
			setServerError('Произошла непредвиденная ошибка');
			console.error('Ошибка запроса:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const allErrors =
		type === 'registration'
			? [
					errors?.login?.message,
					errors?.password?.message,
					errors?.replayPassword?.message,
					isSubmitted && serverError,
				].filter(Boolean)
			: [
					errors?.login?.message,
					errors?.password?.message,
					isSubmitted && serverError,
				].filter(Boolean);

	return {
		register,
		handleSubmit,
		onSubmit,
		allErrors,
		setServerError,
		isSubmitting,
		isValid,
	};
};
