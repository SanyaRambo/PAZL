import { useEffect } from "react";

export const useResetForm = (wasLogout, reset, setServerError) => {
	useEffect(() => {
			if (wasLogout) {
				reset();
				setServerError('');
			}
		}, [wasLogout, reset, setServerError]);
}
