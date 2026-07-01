import { useState, useCallback, useRef, useEffect } from 'react';
import { request } from '../utils/request';

const DEFAULT_LIMIT = 8;

export const usePaginatedData = (
	baseURL,
	inputValue,
	limit = DEFAULT_LIMIT,
	currentUserSession = '',
) => {
	const [data, setData] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [offset, setOffset] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Реф для предотвращения параллельных запросов
	const isLoadingRef = useRef(false);
	// Реф для хранения текущего offset, чтобы не зависеть от состояния в замыкании
	const offsetRef = useRef(offset);

	// Синхронизируем реф с состоянием offset
	useEffect(() => {
		offsetRef.current = offset;
	}, [offset]);

	// Сброс при изменении поиска или сессии
	useEffect(() => {
		setData([]);
		setHasMore(true);
		setOffset(0);
		offsetRef.current = 0;
		setError(null);
	}, [inputValue, currentUserSession]);

	// Основная функция загрузки – стабильная (зависит только от стабильных вещей)
	const loadData = useCallback(
		async (reset = false) => {
			// Защита от одновременных вызовов
			if (isLoadingRef.current) return;

			// Определяем, какой offset использовать
			let currentOffset;
			if (reset) {
				currentOffset = 0;
				// Оптимистично очищаем данные при ручном сбросе (refetch)
				setData([]);
				setHasMore(true);
				setOffset(0);
				offsetRef.current = 0;
			} else {
				currentOffset = offsetRef.current;
			}

			try {
				isLoadingRef.current = true;
				setLoading(true);
				setError(null);

				const hasQuery = baseURL.includes('?');
				const url = hasQuery
				? `${baseURL}&limit=${limit}&offset=${currentOffset}&search=${inputValue || ''}`
				: `${baseURL}?limit=${limit}&offset=${currentOffset}&search=${inputValue || ''}`;

				const result = await request(url, 'GET', null, currentUserSession);

				if (result.res) {
					const newItems = result.res.items || [];
					const more = result.res.hasMore ?? false;

					if (reset) {
						setData(newItems);
					} else {
						setData((prev) => [...prev, ...newItems]);
					}
					setHasMore(more);

					// Обновляем offset: старый + количество новых элементов
					const newOffset = currentOffset + newItems.length;
					setOffset(newOffset);
					offsetRef.current = newOffset;
				} else {
					// Если ошибка от сервера в формате {res: null, error: ...}
					throw new Error(result.error);
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
				isLoadingRef.current = false;
			}
		},
		[baseURL, limit, inputValue, currentUserSession],
	); // Минимум зависимостей!

	// loadMore – просто вызывает loadData без сброса
	const loadMore = useCallback(() => {
		if (hasMore && !isLoadingRef.current && !loading) {
			loadData(false);
		}
	}, [hasMore, loading, loadData]);

	// refetch – принудительная перезагрузка с начала
	const refetch = useCallback(() => {
		loadData(true);
	}, [loadData]);

	return { data, loading, error, hasMore, loadMore, refetch };
};
