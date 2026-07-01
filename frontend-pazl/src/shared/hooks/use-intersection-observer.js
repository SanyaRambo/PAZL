// hooks/useIntersectionObserver.js
import { useRef, useEffect } from 'react';

export const useIntersectionObserver = (callback, options = {}) => {
	const targetRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						callback();
					}
				});
			},
			{
				rootMargin: '200px 0px',
				threshold: 0.3,
				...options,
			},
		);

		const currentTarget = targetRef.current;
		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => observer.disconnect();
	}, [callback]);

	return targetRef;
};
