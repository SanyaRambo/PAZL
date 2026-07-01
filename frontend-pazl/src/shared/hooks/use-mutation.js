// hooks/useMutation.js
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserRole } from '../../entities/user-entite/selectors';
import { ROLE } from '../constants';
import { request } from '../utils/request';

export const useMutation = () => {
	const userRole = useSelector(selectUserRole);
	const [loading, setLoading] = useState(false);

	const mutate = async (operation, method, dataRequest, ...args) => {
		if (userRole === ROLE.GUEST) {
			return { success: false, error: 'НЕ АВТОРИЗОВАН', data: null };
		}
		setLoading(true);

		try {
			const result = await request(operation, method, dataRequest);


			return {
				success: !result.error,
				error: result.error || null,
				data: result.res || null,
			};
		} catch (err) {
			return {
				success: false,
				error: err.message || 'ОШИБКА СЕТИ',
				data: null,
			};
		} finally {
			setLoading(false);
		}
	};

	return { mutate, loading };
};
