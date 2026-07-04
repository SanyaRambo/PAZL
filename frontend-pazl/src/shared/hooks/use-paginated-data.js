import { useState, useCallback, useRef, useEffect } from 'react';
import { request } from '../utils/request';

const DEFAULT_LIMIT = 8;

export const usePaginatedData = (
	baseURL,
	inputValue = '',
	limit = DEFAULT_LIMIT,
	currentUserSession = '',
) => {
	const [data, setData] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [offset, setOffset] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const isLoadingRef = useRef(false);
	const offsetRef = useRef(offset);
	const paramsRef = useRef({}); // ← вместо state используем ref

	useEffect(() => {
		offsetRef.current = offset;
	}, [offset]);

	useEffect(() => {
		setData([]);
		setHasMore(true);
		setOffset(0);
		offsetRef.current = 0;
		setError(null);
	}, [inputValue, currentUserSession]);

	const loadData = useCallback(
		async (reset = false, overrideParams = {}) => {
			if (isLoadingRef.current) return;

			let currentOffset;
			if (reset) {
				currentOffset = 0;
				setData([]);
				setHasMore(true);
				setOffset(0);
				offsetRef.current = 0;
			} else {
				currentOffset = offsetRef.current;
			}

			// Объединяем параметры: из ref + переданные
			const allParams = {
				limit,
				offset: currentOffset,
				search: inputValue || '',
				...paramsRef.current,
				...overrideParams,
			};

			// Сохраняем параметры в ref для следующих загрузок
			paramsRef.current = { ...paramsRef.current, ...overrideParams };

			try {
				isLoadingRef.current = true;
				setLoading(true);
				setError(null);

				const urlParams = new URLSearchParams();
				Object.entries(allParams).forEach(([key, value]) => {
					if (value !== undefined && value !== null && value !== '') {
						urlParams.append(key, String(value));
					}
				});

				const hasQuery = baseURL.includes('?');
				const url = hasQuery
					? `${baseURL}&${urlParams.toString()}`
					: `${baseURL}?${urlParams.toString()}`;

				console.log('📡 Запрос:', url);

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

					const newOffset = currentOffset + newItems.length;
					setOffset(newOffset);
					offsetRef.current = newOffset;
				} else {
					throw new Error(result.error);
				}
			} catch (err) {
				console.error('❌ Ошибка загрузки:', err);
				setError(err.message);
			} finally {
				setLoading(false);
				isLoadingRef.current = false;
			}
		},
		[baseURL, limit, inputValue, currentUserSession], // ← без extraParams
	);

	const loadMore = useCallback(() => {
		if (hasMore && !isLoadingRef.current && !loading) {
			loadData(false);
		}
	}, [hasMore, loading, loadData]);

	// ✅ refetch теперь СТАБИЛЕН (зависит только от loadData)
	const refetch = useCallback(
		(newParams = {}) => {
			paramsRef.current = { ...paramsRef.current, ...newParams };
			loadData(true, newParams);
		},
		[loadData],
	);

	return {
		data,
		loading,
		error,
		hasMore,
		loadMore,
		refetch,
	};
};
