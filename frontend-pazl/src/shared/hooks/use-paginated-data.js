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
	const [extraParams, setExtraParams] = useState({});

	const isLoadingRef = useRef(false);
	const offsetRef = useRef(offset);


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


			const allParams = {
				limit,
				offset: currentOffset,
				search: inputValue || '',
				...extraParams,
				...overrideParams,
			};

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

				console.log('📡 Запрос:', url); // для отладки

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
		[baseURL, limit, inputValue, currentUserSession, extraParams],
	);

	// ✅ loadMore – подгружаем следующую порцию
	const loadMore = useCallback(() => {
		if (hasMore && !isLoadingRef.current && !loading) {
			loadData(false);
		}
	}, [hasMore, loading, loadData]);

	// ✅ refetch – перезагружаем с начала, можно передать новые параметры
	const refetch = useCallback(
		(newParams = {}) => {
			// Сохраняем новые параметры в состояние
			setExtraParams((prev) => ({ ...prev, ...newParams }));
			// Перезагружаем с новыми параметрами
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
		setExtraParams, // для гибкости
	};
};
