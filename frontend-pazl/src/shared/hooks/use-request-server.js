import { useSelector } from 'react-redux';
import { selectUserRole } from '../../entities/user-entite/selectors';
import { ROLE } from '../constants';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { request } from '../utils/request';

export const useRequestServer = (operation, method, dataRequest, ...params) => {
	const idRole = useSelector(selectUserRole);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const MAX_ATTEMPTS = 3;

	const paramsKey = useMemo(() => JSON.stringify(params), [params]);

	const PUBLIC_OPERATION = [
		'/api/register',
		'/api/login',
		'/api/publications',
		'/api/publications/',
		'/api/roles',
		'/api/comments',
	];

	const fetchData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			if (
				idRole === ROLE.GUEST &&
				!PUBLIC_OPERATION.includes(operation) &&
				!operation.startsWith('/api/publications/')
			) {
				setError('ДОСТУП ЗАПРЕЩЁН. ПОЛЬЗОВАТЕЛЬ НЕ АВТОРИЗОВАН.');
				return;
			}

			const result = await request(operation, method, dataRequest);

			if (result.error) {
				setError(result.error);
			} else {
				setData(result.res);
			}
		} catch (err) {
			setError(err.message || 'ПРОИЗОШЛА ОШИБКА');
		} finally {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [operation, idRole, paramsKey]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const refetch = useCallback(() => {
		if (loading) return;
		fetchData();
	}, [fetchData, loading]);

	return { data, loading, error, refetch };
};
